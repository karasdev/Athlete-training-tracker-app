import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging, MulticastMessage } from "firebase-admin/messaging";
import { logger } from "firebase-functions";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

initializeApp();

/**
 * Trigger: a new doc is created at users/{uid}/notifications/{nid}.
 *
 * Doc shape (any client/server can write this):
 *   {
 *     title: string,           // required
 *     body:  string,           // required
 *     data?: Record<string, string>  // optional FCM data payload
 *   }
 *
 * Behavior:
 *   - Reads all FCM tokens registered under users/{uid}/fcmTokens.
 *   - Sends a single multicast message via FCM.
 *   - Prunes tokens that FCM reports as not-registered or invalid.
 */
export const sendOnNotificationCreate = onDocumentCreated(
  "users/{uid}/notifications/{nid}",
  async (event) => {
    const snap = event.data;
    if (!snap) {
      logger.warn("No snapshot data on event");
      return;
    }

    const uid = event.params.uid;
    const payload = snap.data() as {
      title?: string;
      body?: string;
      data?: Record<string, string>;
    };

    const title = payload.title?.toString();
    const body = payload.body?.toString();
    if (!title || !body) {
      logger.warn("Notification doc missing title/body", { uid, payload });
      return;
    }

    const db = getFirestore();
    const tokensSnap = await db
      .collection("users")
      .doc(uid)
      .collection("fcmTokens")
      .get();

    if (tokensSnap.empty) {
      logger.info("No FCM tokens for user", { uid });
      return;
    }

    const tokenDocs = tokensSnap.docs;
    const tokens: string[] = tokenDocs
      .map((d) => (d.get("token") as string | undefined) ?? "")
      .filter((t) => t.length > 0);

    if (tokens.length === 0) {
      logger.info("No valid token strings for user", { uid });
      return;
    }

    const message: MulticastMessage = {
      tokens,
      notification: { title, body },
      data: payload.data,
      android: {
        priority: "high",
        notification: {
          channelId: "default",
        },
      },
    };

    const response = await getMessaging().sendEachForMulticast(message);
    logger.info("FCM send result", {
      uid,
      successCount: response.successCount,
      failureCount: response.failureCount,
    });

    const stalePruneOps: Promise<unknown>[] = [];
    response.responses.forEach((res, i) => {
      if (res.success) return;
      const code = res.error?.code ?? "";
      const isStale =
        code === "messaging/registration-token-not-registered" ||
        code === "messaging/invalid-registration-token" ||
        code === "messaging/invalid-argument";
      if (isStale) {
        stalePruneOps.push(tokenDocs[i].ref.delete());
        logger.info("Pruned stale token", { uid, code });
      } else if (res.error) {
        logger.warn("FCM send error (kept token)", {
          uid,
          code,
          message: res.error.message,
        });
      }
    });

    if (stalePruneOps.length > 0) {
      await Promise.all(stalePruneOps);
    }
  }
);
