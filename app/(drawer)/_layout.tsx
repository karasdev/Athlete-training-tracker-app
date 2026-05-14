import { Ionicons } from "@expo/vector-icons";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import { Href, Redirect, router, usePathname } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "@/features/auth/AuthContext";

type DrawerItem = {
  href: Href;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
};

const drawerItems: DrawerItem[] = [
  { href: "/", icon: "grid-outline", label: "Dashboard" },
  { href: "/add-workout", icon: "add-circle-outline", label: "Add Workout" },
  { href: "/history", icon: "list-outline", label: "History" },
  { href: "/progress", icon: "stats-chart-outline", label: "Progress" },
  { href: "/profile", icon: "person-outline", label: "Profile" },
];

function AppDrawerContent(props: DrawerContentComponentProps) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  function openRoute(href: Href) {
    props.navigation.closeDrawer();
    router.push(href);
  }

  async function handleLogout() {
    props.navigation.closeDrawer();
    await logout();
    router.replace("/login");
  }

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContent}
    >
      <View style={styles.drawerHeader}>
        <View style={styles.brandIcon}>
          <Ionicons name="pulse-outline" size={28} color="#ffffff" />
        </View>
        <Text style={styles.brandTitle}>Athlete Training Tracker</Text>
        <Text numberOfLines={1} style={styles.brandSubtitle}>
          {user?.email}
        </Text>
      </View>

      <View style={styles.menuSection}>
        {drawerItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Pressable
              key={item.href.toString()}
              onPress={() => openRoute(item.href)}
              style={({ pressed }) => [
                styles.menuItem,
                active && styles.menuItemActive,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name={item.icon}
                size={21}
                color={active ? "#2563eb" : "#4b5563"}
              />
              <Text
                style={[styles.menuLabel, active && styles.menuLabelActive]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.drawerFooter}>
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.logoutItem,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="log-out-outline" size={21} color="#dc2626" />
          <Text style={styles.logoutLabel}>Log out</Text>
        </Pressable>
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Drawer
      drawerContent={(props) => <AppDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: "#ffffff",
          width: 304,
        },
        headerShown: false,
        swipeEdgeWidth: 48,
      }}
    >
      <Drawer.Screen name="(tabs)" options={{ title: "Training" }} />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  brandIcon: {
    alignItems: "center",
    backgroundColor: "#2563eb",
    borderRadius: 8,
    height: 48,
    justifyContent: "center",
    marginBottom: 14,
    width: 48,
  },
  brandSubtitle: {
    color: "#6b7280",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 6,
  },
  brandTitle: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 24,
  },
  drawerContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  drawerFooter: {
    borderTopColor: "#e5e7eb",
    borderTopWidth: 1,
    marginTop: "auto",
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  drawerHeader: {
    borderBottomColor: "#e5e7eb",
    borderBottomWidth: 1,
    paddingBottom: 22,
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  logoutItem: {
    alignItems: "center",
    borderRadius: 8,
    flexDirection: "row",
    gap: 12,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  logoutLabel: {
    color: "#dc2626",
    fontSize: 15,
    fontWeight: "800",
  },
  menuItem: {
    alignItems: "center",
    borderRadius: 8,
    flexDirection: "row",
    gap: 12,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  menuItemActive: {
    backgroundColor: "#eff6ff",
  },
  menuLabel: {
    color: "#374151",
    fontSize: 15,
    fontWeight: "700",
  },
  menuLabelActive: {
    color: "#2563eb",
    fontWeight: "800",
  },
  menuSection: {
    gap: 4,
    paddingHorizontal: 14,
    paddingTop: 16,
  },
  pressed: {
    opacity: 0.72,
  },
});
