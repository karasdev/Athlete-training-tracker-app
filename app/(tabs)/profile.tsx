import { useCallback, useState } from "react";
import { ScrollView, Text, TextInput, StyleSheet, Alert } from "react-native";
import { router, useFocusEffect } from "expo-router";
import PrimaryButton from "../../components/PrimaryButton";
import { useAuth } from "../../contexts/AuthContext";
import { getProfile, saveProfile } from "../../utils/profileStorage";

export default function ProfileScreen() {
  const [name, setName] = useState("");
  const [sport, setSport] = useState("");
  const [goal, setGoal] = useState("");
  const { logout, user } = useAuth();

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [user?.id])
  );

  async function loadProfile() {
    if (!user?.id) return;
    const profile = await getProfile(user.id);

    setName(profile.name);
    setSport(profile.sport);
    setGoal(profile.goal);
  }

  async function handleSave() {
    if (!user?.id) return;
    await saveProfile(user.id, {
      name,
      sport,
      goal,
    });

    Alert.alert("Success", "Profile saved successfully.");
  }

  function handleLogout() {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.accountLabel}>Signed in as</Text>
      <Text style={styles.accountEmail}>{user?.email}</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Your name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Sport</Text>
      <TextInput
        style={styles.input}
        placeholder="Example: Football, Running, Basketball"
        value={sport}
        onChangeText={setSport}
      />

      <Text style={styles.label}>Goal</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Example: Improve stamina and strength"
        value={goal}
        onChangeText={setGoal}
        multiline
      />

      <PrimaryButton title="Save Profile" onPress={handleSave} />
      <Text style={styles.logout} onPress={handleLogout}>
        Log out
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  accountLabel: {
    color: "#6b7280",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  accountEmail: {
    color: "#111827",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    marginTop: 14,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  logout: {
    color: "#dc2626",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 22,
    textAlign: "center",
  },
});
