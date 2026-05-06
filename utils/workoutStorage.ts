import * as SecureStore from "expo-secure-store";
import { getAuth } from "firebase/auth";
import { Workout } from "../types/workout";

const WORKOUTS_KEY = "workouts";

function getWorkoutsKey() {
  const userId = getAuth().currentUser?.uid;
  return userId ? `${WORKOUTS_KEY}:${userId}` : WORKOUTS_KEY;
}

export async function getWorkouts(): Promise<Workout[]> {
  try {
    const data = await SecureStore.getItemAsync(getWorkoutsKey());
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log("Failed to load workouts:", error);
    return [];
  }
}

export async function saveWorkouts(workouts: Workout[]) {
  try {
    await SecureStore.setItemAsync(getWorkoutsKey(), JSON.stringify(workouts));
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
