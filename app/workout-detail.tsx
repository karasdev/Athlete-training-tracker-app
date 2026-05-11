import { useCallback, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Workout } from "../types/workout";
import { deleteWorkout, getWorkoutById } from "../utils/workoutStorage";
import PrimaryButton from "../components/PrimaryButton";
import { useAuth } from "../contexts/AuthContext";

export default function WorkoutDetailScreen() {
  const { user } = useAuth();
  const { id } = useLocalSearchParams();
  const workoutId = Array.isArray(id) ? id[0] : id;

  const [workout, setWorkout] = useState<Workout | null>(null);

  useFocusEffect(
    useCallback(() => {
      async function loadWorkout() {
        if (!workoutId || !user?.id) return;

        const data = await getWorkoutById(user.id, workoutId);
        setWorkout(data || null);
      }

      loadWorkout();
    }, [workoutId, user?.id])
  );

  async function handleDelete() {
    const uid = user?.id;
    if (!workoutId || !uid) return;

    Alert.alert("Delete Workout", "Are you sure you want to delete this workout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteWorkout(uid, workoutId);
          router.replace("/history");
        },
      },
    ]);
  }

  if (!workout) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Workout not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{workout.type}</Text>

        <Text style={styles.label}>Date</Text>
        <Text style={styles.value}>
          {new Date(workout.createdAt).toLocaleString()}
        </Text>

        <Text style={styles.label}>Duration</Text>
        <Text style={styles.value}>{workout.duration} minutes</Text>

        <Text style={styles.label}>Intensity</Text>
        <Text style={styles.value}>{workout.intensity}/10</Text>

        <Text style={styles.label}>Notes</Text>
        <Text style={styles.value}>{workout.notes || "No notes"}</Text>
      </View>

      <PrimaryButton title="Delete Workout" onPress={handleDelete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6b7280",
    marginTop: 14,
  },
  value: {
    fontSize: 17,
    color: "#111827",
    marginTop: 4,
  },
  emptyText: {
    color: "#6b7280",
    fontSize: 16,
  },
});
