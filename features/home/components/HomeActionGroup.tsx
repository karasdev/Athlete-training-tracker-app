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
            {actions.map((action) => (
              <View key={action.href.toString()} style={styles.previewIcon}>
                <Ionicons name={action.icon} size={16} color="#2563eb" />
              </View>
            ))}
          </View>
          <Text style={styles.folderLabel}>App</Text>
        </Pressable>
      </View>

      <Modal transparent visible={expanded} animationType="fade">
        <Pressable style={styles.backdrop} onPress={() => setExpanded(false)}>
          <View style={styles.unfoldedPanel}>
            <Text style={styles.panelTitle}>App</Text>
            <View style={styles.appGrid}>
              {actions.map((action) => (
                <Pressable
                  key={action.href.toString()}
                  onPress={() => openAction(action.href)}
                  style={({ pressed }) => [styles.appTile, pressed && styles.tilePressed]}
                >
                  <View style={styles.appIconWrap}>
                    <Ionicons name={action.icon} size={28} color="#2563eb" />
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
    marginTop: 20,
  },
  appGrid: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    rowGap: 18,
  },
  appIconWrap: {
    alignItems: "center",
    backgroundColor: "#eff6ff",
    borderRadius: 14,
    height: 58,
    justifyContent: "center",
    marginBottom: 8,
    width: 58,
  },
  appLabel: {
    color: "#111827",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 15,
    minHeight: 30,
    textAlign: "center",
  },
  appTile: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
    width: "50%",
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
    fontSize: 13,
    fontWeight: "800",
    marginTop: 8,
    textAlign: "center",
  },
  folderPreview: {
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#dbeafe",
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    height: 82,
    justifyContent: "center",
    padding: 9,
    width: 82,
  },
  folderTile: {
    alignItems: "center",
    alignSelf: "flex-start",
    minHeight: 116,
    justifyContent: "center",
    width: 92,
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
    backgroundColor: "#eff6ff",
    borderRadius: 8,
    height: 28,
    justifyContent: "center",
    margin: 3,
    width: 28,
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
    maxWidth: 320,
    padding: 22,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    width: "100%",
  },
});
