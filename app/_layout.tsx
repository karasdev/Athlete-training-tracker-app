import { router, Stack, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

function AuthGate({ children }: { children: React.ReactNode }) {
  const { loading, user } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const isAuthScreen = segments[0] === "login" || segments[0] === "register";

    if (!user && !isAuthScreen) {
      router.replace("/login");
      return;
    }

    if (user && isAuthScreen) {
      router.replace("/");
    }
  }, [loading, segments, user]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#2563eb" size="large" />
      </View>
    );
  }

  return children;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGate>
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
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
        </Stack>
      </AuthGate>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    flex: 1,
    justifyContent: "center",
  },
});
