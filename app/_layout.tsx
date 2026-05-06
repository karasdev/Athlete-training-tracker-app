import { router, Stack, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import AccountMenu from "../components/AccountMenu";
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

function AppStack() {
  return (
    <Stack
      screenOptions={{
        headerRight: () => <AccountMenu />,
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
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="workout-detail" options={{ title: "Workout Detail" }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGate>
        <AppStack />
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
