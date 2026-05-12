import { Ionicons } from "@expo/vector-icons";
import { Href, Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type ActionItem = {
  href: Href;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
};

const actions: ActionItem[] = [
  { href: "/add-workout", icon: "add-circle-outline", label: "Add Workout" },
  { href: "/history", icon: "time-outline", label: "History" },
  { href: "/progress", icon: "analytics-outline", label: "Progress" },
  { href: "/profile", icon: "person-circle-outline", label: "Profile" },
];

export default function HomeActionGroup() {
  return (
    <View style={styles.group}>
      {actions.map((action, index) => {
        const isLast = index === actions.length - 1;

        return (
          <Link key={action.href.toString()} href={action.href} asChild>
            <Pressable
              style={({ pressed }) => [
                styles.row,
                !isLast && styles.rowDivider,
                pressed && styles.rowPressed,
              ]}
            >
              <View style={styles.iconWrap}>
                <Ionicons name={action.icon} size={21} color="#2563eb" />
              </View>
              <Text style={styles.label}>{action.label}</Text>
              <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
            </Pressable>
          </Link>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 20,
    overflow: "hidden",
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: 58,
    paddingHorizontal: 14,
  },
  rowDivider: {
    borderBottomColor: "#eef2f7",
    borderBottomWidth: 1,
  },
  rowPressed: {
    backgroundColor: "#eff6ff",
  },
  iconWrap: {
    alignItems: "center",
    backgroundColor: "#eff6ff",
    borderRadius: 8,
    height: 34,
    justifyContent: "center",
    marginRight: 12,
    width: 34,
  },
  label: {
    color: "#111827",
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
  },
});
