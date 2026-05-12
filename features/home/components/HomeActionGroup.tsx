import { Ionicons } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { useRef, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

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
  const [panelTop, setPanelTop] = useState(0);
  const folderRef = useRef<View>(null);

  function openAction(href: Href) {
    setExpanded(false);
    router.push(href);
  }

  function toggleFolder() {
    if (expanded) {
      setExpanded(false);
      return;
    }

    folderRef.current?.measureInWindow((_, y, __, height) => {
      setPanelTop(y + height + 8);
      setExpanded(true);
    });
  }

  return (
    <View style={styles.container}>
      <View ref={folderRef} style={styles.group}>
        <Pressable
          onPress={toggleFolder}
          style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
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
      </View>

      <Modal transparent visible={expanded} animationType="fade">
        <Pressable style={styles.backdrop} onPress={() => setExpanded(false)}>
          <View style={[styles.unfoldedPanel, { top: panelTop }]}>
            {actions.map((action, index) => {
              const isLast = index === actions.length - 1;

              return (
                <Pressable
                  key={action.href.toString()}
                  onPress={() => openAction(action.href)}
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
            })}
          </View>
        </Pressable>
      </Modal>
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
  backdrop: {
    flex: 1,
    paddingHorizontal: 20,
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
  unfoldedPanel: {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    borderRadius: 8,
    borderWidth: 1,
    elevation: 8,
    left: 20,
    overflow: "hidden",
    position: "absolute",
    right: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
  },
});
