import { Platform } from "react-native";

async function ensureNotificationPermission() {
  const Notifications = await import("expo-notifications");

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus === "granted") {
    return Notifications;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted" ? Notifications : null;
}

export async function scheduleWorkoutSavedNotification(workoutType: string, duration: number) {
  const Notifications = await ensureNotificationPermission();
  if (!Notifications) {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Workout logged",
      body: `${workoutType} workout saved (${duration} min)`,
    },
    trigger: null,
  });
}
