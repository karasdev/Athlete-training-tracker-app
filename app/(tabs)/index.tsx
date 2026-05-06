import { useCallback, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { getWorkouts } from "../../utils/workoutStorage";
import { Workout } from "../../types/workout";
import WorkoutCard from "../../components/WorkoutCard";

export default function HomeScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadWorkouts();
    }, [])
  );

  async function loadWorkouts() {
    const data = await getWorkouts();
    setWorkouts(data);
  }

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

      <View style={styles.menu}>
        <Link href="/add-workout" asChild>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuText}>Add Workout</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/history" asChild>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuText}>History</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/progress" asChild>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuText}>Progress</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/profile" asChild>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>
        </Link>
      </View>

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
    color: "#2563eb",
  },
  statLabel: {
    marginTop: 4,
    color: "#6b7280",
  },
  menu: {
    marginTop: 20,
    gap: 10,
  },
  menuButton: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 14,
  },
  menuText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
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
