import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#2563eb",
        },
        headerTintColor: "#ffffff",
        headerTitleStyle: {
          fontWeight: "700",
        },
        contentStyle: {
          backgroundColor: "#f3f4f6",
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Dashboard" }} />
      <Stack.Screen name="add-workout" options={{ title: "Add Workout" }} />
      <Stack.Screen name="history" options={{ title: "Workout History" }} />
      <Stack.Screen name="workout-detail" options={{ title: "Workout Detail" }} />
      <Stack.Screen name="progress" options={{ title: "Progress" }} />
      <Stack.Screen name="profile" options={{ title: "Profile" }} />
    </Stack>
  );
}