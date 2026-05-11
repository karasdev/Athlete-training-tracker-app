import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import admin from "firebase-admin";

function getRequiredEnv(name) {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required env var: ${name}`);
  return val;
}

function loadServiceAccount() {
  const explicitPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!explicitPath) {
    throw new Error(
      "Set GOOGLE_APPLICATION_CREDENTIALS to your Firebase service account JSON path."
    );
  }
  const abs = path.isAbsolute(explicitPath)
    ? explicitPath
    : path.resolve(process.cwd(), explicitPath);
  const raw = fs.readFileSync(abs, "utf8");
  return JSON.parse(raw);
}

const projectId = getRequiredEnv("FIREBASE_PROJECT_ID");
const serviceAccount = loadServiceAccount();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId,
});

const db = admin.firestore();
const messaging = admin.messaging();

console.log(`[watch:push] Project: ${projectId}`);
console.log("[watch:push] Watching: users/*/notifications/*");

function userTokensRef(uid) {
  return db.collection("users").doc(uid).collection("fcmTokens");
}

async function fetchTokens(uid) {
  const snap = await userTokensRef(uid).get();
  return snap.docs
    .map((d) => (d.get("token") || "").toString())
    .filter((t) => t.length > 0);
}

function isStaleErrorCode(code) {
  return (
    code === "messaging/registration-token-not-registered" ||
    code === "messaging/invalid-registration-token" ||
    code === "messaging/invalid-argument"
  );
}

async function pruneTokenDocs(uid, badTokens) {
  if (badTokens.length === 0) return;
  const snap = await userTokensRef(uid).get();
  const ops = [];
  for (const docSnap of snap.docs) {
    const tok = (docSnap.get("token") || "").toString();
    if (badTokens.includes(tok)) ops.push(docSnap.ref.delete());
  }
  await Promise.all(ops);
}

db.collectionGroup("notifications").onSnapshot(
  async (qs) => {
    for (const change of qs.docChanges()) {
      if (change.type !== "added") continue;

      const doc = change.doc;
      const parts = doc.ref.path.split("/");
      // users/{uid}/notifications/{nid}
      const uid = parts[1];
      const nid = parts[3];

      const data = doc.data() || {};
      const title = (data.title || "").toString();
      const body = (data.body || "").toString();
      const payloadData = data.data && typeof data.data === "object" ? data.data : undefined;

      if (!title || !body) {
        console.log(`[watch:push] skip ${doc.ref.path} missing title/body`);
        continue;
      }

      const tokens = await fetchTokens(uid);
      if (tokens.length === 0) {
        console.log(`[watch:push] no tokens for uid=${uid} (nid=${nid})`);
        continue;
      }

      try {
        const resp = await messaging.sendEachForMulticast({
          tokens,
          notification: { title, body },
          data: payloadData,
          android: { priority: "high", notification: { channelId: "default" } },
        });

        console.log(
          `[watch:push] sent nid=${nid} uid=${uid} success=${resp.successCount} fail=${resp.failureCount}`
        );

        const badTokens = [];
        resp.responses.forEach((r, i) => {
          if (r.success) return;
          const code = r.error?.code;
          if (code && isStaleErrorCode(code)) badTokens.push(tokens[i]);
        });
        await pruneTokenDocs(uid, badTokens);
      } catch (err) {
        console.log(`[watch:push] send error nid=${nid} uid=${uid}`, err);
      }
    }
  },
  (err) => {
    console.error("[watch:push] Firestore watch error", err);
    process.exitCode = 1;
  }
);

