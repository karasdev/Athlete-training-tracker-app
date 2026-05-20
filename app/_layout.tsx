import "react-native-gesture-handler";
import { Stack } from "expo-router";
import AccountMenu from "@/features/auth/components/AccountMenu";
import { AuthProvider } from "@/features/auth/AuthContext";

function AppStack() {
  return (
    <Stack
      screenOptions={{
        headerRight: () => <AccountMenu />,
        headerStyle: {
          backgroundColor: "#16a34a",
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
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen name="workout-detail" options={{ title: "Workout Detail" }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppStack />
    </AuthProvider>
  );
}
