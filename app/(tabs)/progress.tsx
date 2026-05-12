import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { useAuth } from "@/features/auth/AuthContext";
import { Workout } from "@/features/workouts/types";
import { getWorkouts } from "@/features/workouts/workoutStorage";

export default function ProgressScreen() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const loadWorkouts = useCallback(async () => {
    if (!user?.id) return;
    const data = await getWorkouts(user.id);
    setWorkouts(data);
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadWorkouts();
    }, [loadWorkouts])
  );

  const totalWorkouts = workouts.length;
  const totalMinutes = workouts.reduce((sum, workout) => sum + workout.duration, 0);
  const averageIntensity =
    totalWorkouts === 0
      ? 0
      : workouts.reduce((sum, workout) => sum + workout.intensity, 0) / totalWorkouts;
  const longestWorkout = workouts.reduce(
    (max, workout) => Math.max(max, workout.duration),
    0
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Progress</Text>
      <Text style={styles.subtitle}>Your training totals so far.</Text>

      <View style={styles.grid}>
        <View style={styles.card}>
          <Text style={styles.value}>{totalWorkouts}</Text>
          <Text style={styles.label}>Workouts</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.value}>{totalMinutes}</Text>
          <Text style={styles.label}>Minutes</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.value}>{averageIntensity.toFixed(1)}</Text>
          <Text style={styles.label}>Avg Intensity</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.value}>{longestWorkout}</Text>
          <Text style={styles.label}>Longest Min</Text>
        </View>
      </View>
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
  heading: {
    color: "#111827",
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: 16,
    marginTop: 6,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 104,
    padding: 18,
    width: "48%",
  },
  value: {
    color: "#2563eb",
    fontSize: 28,
    fontWeight: "800",
  },
  label: {
    color: "#6b7280",
    fontSize: 14,
    marginTop: 6,
  },
});
