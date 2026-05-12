import * as SecureStore from "expo-secure-store";
import { Workout } from "./types";

const WORKOUTS_KEY = "workouts";

function keyForUser(userId: string) {
  return `${WORKOUTS_KEY}_${userId}`;
}

export async function getWorkouts(userId: string): Promise<Workout[]> {
  try {
    const data = await SecureStore.getItemAsync(keyForUser(userId));
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log("Failed to load workouts:", error);
    return [];
  }
}

export async function saveWorkouts(userId: string, workouts: Workout[]) {
  try {
    await SecureStore.setItemAsync(keyForUser(userId), JSON.stringify(workouts));
  } catch (error) {
    console.log("Failed to save workouts:", error);
  }
}

export async function addWorkout(userId: string, workout: Workout) {
  const workouts = await getWorkouts(userId);
  const updatedWorkouts = [workout, ...workouts];
  await saveWorkouts(userId, updatedWorkouts);
}

export async function getWorkoutById(userId: string, id: string): Promise<Workout | undefined> {
  const workouts = await getWorkouts(userId);
  return workouts.find((workout) => workout.id === id);
}

export async function deleteWorkout(userId: string, id: string) {
  const workouts = await getWorkouts(userId);
  const updatedWorkouts = workouts.filter((workout) => workout.id !== id);
  await saveWorkouts(userId, updatedWorkouts);
}
