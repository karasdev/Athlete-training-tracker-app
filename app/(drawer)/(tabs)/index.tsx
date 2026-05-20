import { useCallback, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { Workout } from "@/features/workouts/types";
import { getWorkouts } from "@/features/workouts/workoutStorage";
import WorkoutCard from "@/features/workouts/components/WorkoutCard";
import { useAuth } from "@/features/auth/AuthContext";
import HomeActionGroup from "@/features/home/components/HomeActionGroup";

export default function HomeScreen() {
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
  const recentWorkouts = workouts.slice(0, 3);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Athlete Training Tracker</Text>
      <Text style={styles.subtitle}>Track your workouts and progress.</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalWorkouts}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalMinutes}</Text>
          <Text style={styles.statLabel}>Minutes</Text>
        </View>
      </View>

      <HomeActionGroup />

      <Text style={styles.sectionTitle}>Recent Workouts</Text>

      {recentWorkouts.length === 0 ? (
        <Text style={styles.emptyText}>No workouts yet. Add your first workout.</Text>
      ) : (
        recentWorkouts.map((workout) => (
          <Link
            key={workout.id}
            href={{
              pathname: "/workout-detail",
              params: { id: workout.id },
            }}
            asChild
          >
            <WorkoutCard workout={workout} />
          </Link>
        ))
      )}
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
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 16,
    color: "#6b7280",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "800",
    color: "#16a34a",
  },
  statLabel: {
    marginTop: 4,
    color: "#6b7280",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginTop: 28,
    marginBottom: 12,
  },
  emptyText: {
    color: "#6b7280",
    fontSize: 15,
  },
});
