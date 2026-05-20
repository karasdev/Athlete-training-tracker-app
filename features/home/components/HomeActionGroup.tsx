import { Ionicons } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type ActionItem = {
  href: Href;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
};

const actions: ActionItem[] = [
  { href: "/add-workout", icon: "add-circle-outline", label: "Add Workout" },
  { href: "/history", icon: "time-outline", label: "History" },
  { href: "/calendar", icon: "calendar-outline", label: "Calendar" },
  { href: "/progress", icon: "analytics-outline", label: "Progress" },
  { href: "/profile", icon: "person-circle-outline", label: "Profile" },
];

export default function HomeActionGroup() {
  const [expanded, setExpanded] = useState(false);

  function openAction(href: Href) {
    setExpanded(false);
    router.push(href);
  }

  function toggleFolder() {
    if (expanded) {
      setExpanded(false);
      return;
    }

    setExpanded(true);
  }

  return (
    <View style={styles.container}>
      <View>
        <Pressable
          onPress={toggleFolder}
          style={({ pressed }) => [styles.folderTile, pressed && styles.tilePressed]}
        >
          <View style={styles.folderPreview}>
            <View style={styles.previewRow}>
              {actions.slice(0, 2).map((action) => (
                <View key={action.href.toString()} style={styles.previewIcon}>
                  <Ionicons name={action.icon} size={17} color="#16a34a" />
                </View>
              ))}
            </View>
            <View style={styles.previewRow}>
              {actions.slice(2, 4).map((action) => (
                <View key={action.href.toString()} style={styles.previewIcon}>
                  <Ionicons name={action.icon} size={17} color="#16a34a" />
                </View>
              ))}
            </View>
          </View>
          <Text style={styles.folderLabel}>Training</Text>
        </Pressable>
      </View>

      <Modal transparent visible={expanded} animationType="fade">
        <Pressable style={styles.backdrop} onPress={() => setExpanded(false)}>
          <View style={styles.unfoldedPanel}>
            <Text style={styles.panelTitle}>Training</Text>
            <View style={styles.appGrid}>
              {actions.map((action) => (
                <Pressable
                  key={action.href.toString()}
                  onPress={() => openAction(action.href)}
                  style={({ pressed }) => [styles.appTile, pressed && styles.tilePressed]}
                >
                  <View style={styles.appIconWrap}>
                    <Ionicons name={action.icon} size={28} color="#16a34a" />
                  </View>
                  <Text numberOfLines={2} style={styles.appLabel}>
                    {action.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 22,
    marginTop: 24,
  },
  appGrid: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    rowGap: 20,
  },
  appIconWrap: {
    alignItems: "center",
    backgroundColor: "#ecfdf5",
    borderColor: "#bbf7d0",
    borderRadius: 18,
    borderWidth: 1,
    height: 64,
    justifyContent: "center",
    marginBottom: 9,
    width: 64,
  },
  appLabel: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 16,
    minHeight: 32,
    textAlign: "center",
  },
  appTile: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 112,
    width: "33.333%",
  },
  backdrop: {
    alignItems: "center",
    backgroundColor: "rgba(17, 24, 39, 0.22)",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  folderLabel: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 9,
    textAlign: "center",
  },
  folderPreview: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#d1d5db",
    borderRadius: 22,
    borderWidth: 1,
    elevation: 2,
    height: 96,
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    width: 96,
  },
  folderTile: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 128,
    width: 108,
  },
  panelTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 18,
    textAlign: "center",
  },
  previewIcon: {
    alignItems: "center",
    backgroundColor: "#ecfdf5",
    borderRadius: 10,
    height: 31,
    justifyContent: "center",
    width: 31,
  },
  previewRow: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 4,
  },
  tilePressed: {
    opacity: 0.72,
  },
  unfoldedPanel: {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    borderRadius: 20,
    borderWidth: 1,
    elevation: 8,
    maxWidth: 330,
    padding: 24,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    width: "100%",
  },
});
