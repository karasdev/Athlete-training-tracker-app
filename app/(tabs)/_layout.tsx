import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import AccountMenu from "@/features/auth/components/AccountMenu";
import { useAuth } from "@/features/auth/AuthContext";

export default function TabLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerRight: () => <AccountMenu />,
        headerStyle: {
          backgroundColor: "#2563eb",
        },
        headerTintColor: "#ffffff",
        headerTitleStyle: {
          fontWeight: "700",
        },
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#6b7280",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
        },
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#e5e7eb",
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name="grid-outline" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="add-workout"
        options={{
          title: "Add",
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name="add-circle-outline" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name="list-outline" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name="stats-chart-outline" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name="person-outline" size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
