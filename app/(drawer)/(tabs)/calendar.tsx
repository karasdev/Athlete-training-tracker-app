import { Ionicons } from "@expo/vector-icons";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "@/features/auth/AuthContext";
import WorkoutCard from "@/features/workouts/components/WorkoutCard";
import { getWorkouts } from "@/features/workouts/workoutStorage";
import { Workout } from "@/features/workouts/types";

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function sameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function buildCalendarDays(month: Date) {
  const firstDay = startOfMonth(month);
  const gridStart = new Date(firstDay);
  gridStart.setDate(firstDay.getDate() - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return day;
  });
}

function groupWorkoutsByDate(workouts: Workout[]) {
  return workouts.reduce<Record<string, Workout[]>>((groups, workout) => {
    const key = toDateKey(new Date(workout.createdAt));
    groups[key] = groups[key] ? [...groups[key], workout] : [workout];
    return groups;
  }, {});
}

export default function CalendarScreen() {
  const { user } = useAuth();
  const todayKey = toDateKey(new Date());
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(todayKey);
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

  const workoutsByDate = useMemo(() => groupWorkoutsByDate(workouts), [workouts]);
  const calendarDays = useMemo(
    () => buildCalendarDays(visibleMonth),
    [visibleMonth]
  );
  const selectedWorkouts = workoutsByDate[selectedDate] ?? [];
  const selectedMinutes = selectedWorkouts.reduce(
    (total, workout) => total + workout.duration,
    0
  );
  const monthLabel = visibleMonth.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
  const selectedLabel = new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "long",
      weekday: "long",
      year: "numeric",
    }
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Calendar</Text>
      <Text style={styles.subtitle}>Review training by day.</Text>

      <View style={styles.calendarCard}>
        <View style={styles.monthHeader}>
          <Pressable
            accessibilityLabel="Previous month"
            onPress={() => setVisibleMonth((current) => addMonths(current, -1))}
            style={({ pressed }) => [styles.monthButton, pressed && styles.pressed]}
          >
            <Ionicons name="chevron-back" size={22} color="#111827" />
          </Pressable>
          <Text style={styles.monthTitle}>{monthLabel}</Text>
          <Pressable
            accessibilityLabel="Next month"
            onPress={() => setVisibleMonth((current) => addMonths(current, 1))}
            style={({ pressed }) => [styles.monthButton, pressed && styles.pressed]}
          >
            <Ionicons name="chevron-forward" size={22} color="#111827" />
          </Pressable>
        </View>

        <View style={styles.weekHeader}>
          {dayLabels.map((day) => (
            <Text key={day} style={styles.weekLabel}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.calendarGrid}>
          {calendarDays.map((day) => {
            const dateKey = toDateKey(day);
            const dayWorkouts = workoutsByDate[dateKey] ?? [];
            const active = selectedDate === dateKey;
            const isToday = todayKey === dateKey;
            const inMonth = sameMonth(day, visibleMonth);

            return (
              <Pressable
                key={dateKey}
                onPress={() => setSelectedDate(dateKey)}
                style={({ pressed }) => [
                  styles.dayCell,
                  !inMonth && styles.dayCellMuted,
                  active && styles.dayCellActive,
                  pressed && styles.pressed,
                ]}
              >
                <Text
                  style={[
                    styles.dayNumber,
                    !inMonth && styles.dayNumberMuted,
                    active && styles.dayNumberActive,
                    isToday && !active && styles.dayNumberToday,
                  ]}
                >
                  {day.getDate()}
                </Text>
                {dayWorkouts.length > 0 ? (
                  <View style={[styles.dayBadge, active && styles.dayBadgeActive]}>
                    <Text
                      style={[
                        styles.dayBadgeText,
                        active && styles.dayBadgeTextActive,
                      ]}
                    >
                      {dayWorkouts.length}
                    </Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.selectedDate}>{selectedLabel}</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryMetric}>
            <Text style={styles.summaryValue}>{selectedWorkouts.length}</Text>
            <Text style={styles.summaryLabel}>Workouts</Text>
          </View>
          <View style={styles.summaryMetric}>
            <Text style={styles.summaryValue}>{selectedMinutes}</Text>
            <Text style={styles.summaryLabel}>Minutes</Text>
          </View>
        </View>
      </View>

      {selectedWorkouts.length === 0 ? (
        <Text style={styles.emptyText}>No workouts logged for this day.</Text>
      ) : (
        selectedWorkouts.map((workout) => (
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
  calendarCard: {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 20,
    padding: 12,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  dayBadge: {
    alignItems: "center",
    backgroundColor: "#dcfce7",
    borderRadius: 8,
    height: 16,
    justifyContent: "center",
    marginTop: 3,
    minWidth: 16,
    paddingHorizontal: 4,
  },
  dayBadgeActive: {
    backgroundColor: "#ffffff",
  },
  dayBadgeText: {
    color: "#16a34a",
    fontSize: 10,
    fontWeight: "800",
  },
  dayBadgeTextActive: {
    color: "#16a34a",
  },
  dayCell: {
    alignItems: "center",
    aspectRatio: 1,
    borderRadius: 8,
    justifyContent: "center",
    marginVertical: 2,
    width: "14.2857%",
  },
  dayCellActive: {
    backgroundColor: "#16a34a",
  },
  dayCellMuted: {
    opacity: 0.42,
  },
  dayNumber: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "700",
  },
  dayNumberActive: {
    color: "#ffffff",
  },
  dayNumberMuted: {
    color: "#6b7280",
  },
  dayNumberToday: {
    color: "#16a34a",
  },
  emptyText: {
    color: "#6b7280",
    fontSize: 15,
    marginTop: 14,
  },
  heading: {
    color: "#111827",
    fontSize: 28,
    fontWeight: "800",
  },
  monthButton: {
    alignItems: "center",
    borderColor: "#e5e7eb",
    borderRadius: 8,
    borderWidth: 1,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  monthHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  monthTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "800",
  },
  pressed: {
    opacity: 0.72,
  },
  selectedDate: {
    color: "#111827",
    fontSize: 17,
    fontWeight: "800",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: 16,
    marginTop: 6,
  },
  summaryCard: {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 14,
    padding: 16,
  },
  summaryLabel: {
    color: "#6b7280",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2,
  },
  summaryMetric: {
    flex: 1,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
  },
  summaryValue: {
    color: "#16a34a",
    fontSize: 24,
    fontWeight: "800",
  },
  weekHeader: {
    flexDirection: "row",
    marginBottom: 4,
  },
  weekLabel: {
    color: "#6b7280",
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
    width: "14.2857%",
  },
});
