import AsyncStorage from "@react-native-async-storage/async-storage";
import { Workout } from "../types/workout";

const WORKOUTS_KEY = "workouts";

export async function getWorkouts(): Promise<Workout[]> {
  try {
    const data = await AsyncStorage.getItem(WORKOUTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log("Failed to load workouts:", error);
    return [];
  }
}

export async function saveWorkouts(workouts: Workout[]) {
  try {
    await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
  } catch (error) {
    console.log("Failed to save workouts:", error);
  }
}

export async function addWorkout(workout: Workout) {
  const workouts = await getWorkouts();
  const updatedWorkouts = [workout, ...workouts];
  await saveWorkouts(updatedWorkouts);
}

export async function getWorkoutById(id: string): Promise<Workout | undefined> {
  const workouts = await getWorkouts();
  return workouts.find((workout) => workout.id === id);
}

export async function deleteWorkout(id: string) {
  const workouts = await getWorkouts();
  const updatedWorkouts = workouts.filter((workout) => workout.id !== id);
  await saveWorkouts(updatedWorkouts);
}