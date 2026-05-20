import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Workout } from "@/features/workouts/types";

type Props = {
  workout: Workout;
  onPress?: () => void;
};

export default function WorkoutCard({ workout, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View>
        <Text style={styles.title}>{workout.type}</Text>
        <Text style={styles.date}>
          {new Date(workout.createdAt).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>{workout.duration} min</Text>
        <Text style={styles.infoText}>Intensity {workout.intensity}/10</Text>
      </View>

      {workout.notes ? <Text style={styles.notes}>{workout.notes}</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  date: {
    marginTop: 4,
    color: "#6b7280",
  },
  info: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  infoText: {
    color: "#16a34a",
    fontWeight: "600",
  },
  notes: {
    marginTop: 10,
    color: "#374151",
  },
});
