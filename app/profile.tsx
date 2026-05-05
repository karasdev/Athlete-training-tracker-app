import { useCallback, useState } from "react";
import { ScrollView, Text, TextInput, StyleSheet, Alert } from "react-native";
import { useFocusEffect } from "expo-router";
import PrimaryButton from "../components/PrimaryButton";
import { getProfile, saveProfile } from "../utils/profileStorage";

export default function ProfileScreen() {
  const [name, setName] = useState("");
  const [sport, setSport] = useState("");
  const [goal, setGoal] = useState("");

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  async function loadProfile() {
    const profile = await getProfile();

    setName(profile.name);
    setSport(profile.sport);
    setGoal(profile.goal);
  }

  async function handleSave() {
    await saveProfile({
      name,
      sport,
      goal,
    });

    Alert.alert("Success", "Profile saved successfully.");
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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
});