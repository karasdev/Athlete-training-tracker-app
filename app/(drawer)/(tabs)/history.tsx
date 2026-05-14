import { useCallback, useState } from "react";
import { ScrollView, Text, TextInput, StyleSheet } from "react-native";
import { Link, useFocusEffect } from "expo-router";
import WorkoutCard from "@/features/workouts/components/WorkoutCard";
import { useAuth } from "@/features/auth/AuthContext";
import { Workout } from "@/features/workouts/types";
import { getWorkouts } from "@/features/workouts/workoutStorage";

export default function HistoryScreen() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [search, setSearch] = useState("");

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

  const filteredWorkouts = workouts.filter((workout) =>
    workout.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search workout type..."
        value={search}
        onChangeText={setSearch}
      />

      {filteredWorkouts.length === 0 ? (
        <Text style={styles.emptyText}>No workouts found.</Text>
      ) : (
        filteredWorkouts.map((workout) => (
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
  searchInput: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  emptyText: {
    color: "#6b7280",
    fontSize: 15,
  },
});
