import { useState } from "react";
import { Text, TextInput, StyleSheet, Alert, ScrollView } from "react-native";
import { router } from "expo-router";
import PrimaryButton from "@/components/PrimaryButton";
import { useAuth } from "@/features/auth/AuthContext";
import { apiFetch, throwIfNotOk } from "@/features/shared/api";
import { Workout } from "@/features/workouts/types";
import { scheduleWorkoutSavedNotification } from "@/features/workouts/workoutNotifications";
import { addWorkout } from "@/features/workouts/workoutStorage";

export default function AddWorkoutScreen() {
  const { user } = useAuth();
  const [type, setType] = useState("");
  const [duration, setDuration] = useState("");
  const [intensity, setIntensity] = useState("");
  const [notes, setNotes] = useState("");

  async function handleSave() {
    if (!type.trim()) {
      Alert.alert("Validation Error", "Please enter workout type.");
      return;
    }

    if (!duration.trim() || Number(duration) <= 0) {
      Alert.alert("Validation Error", "Please enter valid duration.");
      return;
    }

    if (!intensity.trim() || Number(intensity) < 1 || Number(intensity) > 10) {
      Alert.alert("Validation Error", "Intensity should be between 1 and 10.");
      return;
    }

    if (!user?.id) {
      Alert.alert("Error", "You must be signed in.");
      return;
    }

    const workout: Workout = {
      id: Date.now().toString(),
      type: type.trim(),
      duration: Number(duration),
      intensity: Number(intensity),
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    };

    await addWorkout(user.id, workout);

    try {
      const res = await apiFetch("/api/v1/workouts", {
        method: "POST",
        body: JSON.stringify({
          id: workout.id,
          type: workout.type,
          duration: workout.duration,
          intensity: workout.intensity,
          notes: workout.notes ?? "",
          createdAt: workout.createdAt,
        }),
      });
      await throwIfNotOk(res);
    } catch (syncError) {
      console.log("Failed to sync workout:", syncError);
    }

    try {
      await scheduleWorkoutSavedNotification(workout.type, workout.duration);
    } catch (notificationError) {
      console.log("Failed to show workout notification:", notificationError);
    }

    setType("");
    setDuration("");
    setIntensity("");
    setNotes("");

    Alert.alert("Success", "Workout saved successfully.");
    router.replace("/history");
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Workout Type</Text>
      <TextInput
        style={styles.input}
        placeholder="Example: Running, Football, Gym"
        value={type}
        onChangeText={setType}
      />

      <Text style={styles.label}>Duration</Text>
      <TextInput
        style={styles.input}
        placeholder="Minutes"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Intensity</Text>
      <TextInput
        style={styles.input}
        placeholder="1 - 10"
        value={intensity}
        onChangeText={setIntensity}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="How did the training feel?"
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      <PrimaryButton title="Save Workout" onPress={handleSave} />
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
