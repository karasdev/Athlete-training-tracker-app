import { router, Stack, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from "react-native";
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

function AccountMenu() {
  const { logout, user } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);

  async function handleLogout() {
    setMenuVisible(false);
    await logout();
    router.replace("/login");
  }

  if (!user?.email) {
    return null;
  }

  return (
    <View>
      <Pressable
        onPress={() => setMenuVisible(true)}
        style={({ pressed }) => [styles.headerAccountButton, pressed && styles.pressed]}
      >
        <Text numberOfLines={1} style={styles.headerEmail}>
          {user.email}
        </Text>
        <Text style={styles.headerChevron}>v</Text>
      </Pressable>

      <Modal transparent visible={menuVisible} animationType="fade">
        <Pressable style={styles.menuOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.accountMenu}>
            <Text style={styles.menuLabel}>Signed in as</Text>
            <Text numberOfLines={1} style={styles.menuEmail}>
              {user.email}
            </Text>
            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}
            >
              <Text style={styles.logoutText}>Log out</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
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
      <Stack.Screen name="index" options={{ title: "Dashboard" }} />
      <Stack.Screen name="add-workout" options={{ title: "Add Workout" }} />
      <Stack.Screen name="history" options={{ title: "Workout History" }} />
      <Stack.Screen name="workout-detail" options={{ title: "Workout Detail" }} />
      <Stack.Screen name="progress" options={{ title: "Progress" }} />
      <Stack.Screen name="profile" options={{ title: "Profile" }} />
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
  headerAccountButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    maxWidth: 170,
    paddingVertical: 6,
  },
  headerEmail: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
    maxWidth: 150,
  },
  headerChevron: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "800",
  },
  menuOverlay: {
    flex: 1,
  },
  accountMenu: {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    borderRadius: 8,
    borderWidth: 1,
    elevation: 6,
    padding: 12,
    position: "absolute",
    right: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    top: 54,
    width: 230,
  },
  menuLabel: {
    color: "#6b7280",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  menuEmail: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: "#fee2e2",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  logoutText: {
    color: "#dc2626",
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },
  pressed: {
    opacity: 0.75,
  },
});
