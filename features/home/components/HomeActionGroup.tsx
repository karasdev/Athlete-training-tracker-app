import { Ionicons } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { useState } from "react";
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
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.group}>
        <Pressable
          onPress={() => setExpanded((current) => !current)}
          style={({ pressed }) => [
            styles.row,
            expanded && styles.rowDivider,
            pressed && styles.rowPressed,
          ]}
        >
          <View style={styles.folderIconWrap}>
            <Ionicons
              name={expanded ? "folder-open-outline" : "folder-outline"}
              size={22}
              color="#2563eb"
            />
          </View>
          <View style={styles.folderTextWrap}>
            <Text style={styles.label}>App</Text>
            <Text style={styles.meta}>
              {expanded ? "Choose a section" : "4 sections"}
            </Text>
          </View>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={18}
            color="#9ca3af"
          />
        </Pressable>

        {expanded
          ? actions.map((action, index) => {
              const isLast = index === actions.length - 1;

              return (
                <Pressable
                  key={action.href.toString()}
                  onPress={() => router.push(action.href)}
                  style={({ pressed }) => [
                    styles.childRow,
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
              );
            })
          : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  group: {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden",
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: 58,
    paddingHorizontal: 14,
  },
  childRow: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: 54,
    paddingLeft: 26,
    paddingRight: 14,
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
  folderIconWrap: {
    alignItems: "center",
    backgroundColor: "#dbeafe",
    borderRadius: 8,
    height: 36,
    justifyContent: "center",
    marginRight: 12,
    width: 36,
  },
  folderTextWrap: {
    flex: 1,
  },
  label: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "700",
  },
  meta: {
    color: "#6b7280",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
});
