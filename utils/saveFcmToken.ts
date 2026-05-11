import { Platform } from "react-native";
import { apiFetch, throwIfNotOk } from "./api";

export async function saveFcmToken(token: string) {
  try {
    const res = await apiFetch("/api/v1/devices/fcm", {
      method: "POST",
      body: JSON.stringify({ token, platform: Platform.OS }),
    });
    await throwIfNotOk(res);
  } catch (error) {
    console.log("Failed to save FCM token:", error);
  }
}

export async function removeFcmToken(token: string) {
  try {
    const res = await apiFetch("/api/v1/devices/fcm", {
      method: "DELETE",
      body: JSON.stringify({ token }),
    });
    await throwIfNotOk(res);
  } catch (error) {
    console.log("Failed to remove FCM token:", error);
  }
}

export async function removeFcmTokenForCurrentDevice() {
  if (Platform.OS !== "android") return;
  try {
    const Notifications = await import("expo-notifications");
    const { data: token } = await Notifications.getDevicePushTokenAsync();
    if (typeof token === "string" && token.length > 0) {
      await removeFcmToken(token);
    }
  } catch (error) {
    console.log("Failed to remove FCM token on logout:", error);
  }
}
