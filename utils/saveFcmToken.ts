import { deleteDoc, doc, Firestore, serverTimestamp, setDoc } from "firebase/firestore";
import { Platform } from "react-native";

// FCM tokens look like "<instanceId>:APA91b...".
// Use the stable instance id portion as the Firestore doc id so the same
// device always maps to a single doc (token rotation just updates fields).
function tokenDocId(token: string): string {
  const colonIdx = token.indexOf(":");
  return colonIdx > 0 ? token.slice(0, colonIdx) : token;
}

export async function saveFcmToken(db: Firestore, uid: string, token: string) {
  try {
    const id = tokenDocId(token);
    await setDoc(
      doc(db, "users", uid, "fcmTokens", id),
      {
        token,
        platform: Platform.OS,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.log("Failed to save FCM token:", error);
  }
}

export async function removeFcmToken(db: Firestore, uid: string, token: string) {
  try {
    const id = tokenDocId(token);
    await deleteDoc(doc(db, "users", uid, "fcmTokens", id));
  } catch (error) {
    console.log("Failed to remove FCM token:", error);
  }
}

// Convenience: looks up the current device's FCM token at call time and
// removes its Firestore doc. Used during logout where we don't have the
// token in scope.
export async function removeFcmTokenForCurrentDevice(db: Firestore, uid: string) {
  if (Platform.OS !== "android") return;
  try {
    const Notifications = await import("expo-notifications");
    const { data: token } = await Notifications.getDevicePushTokenAsync();
    if (typeof token === "string" && token.length > 0) {
      await removeFcmToken(db, uid, token);
    }
  } catch (error) {
    console.log("Failed to remove FCM token on logout:", error);
  }
}
