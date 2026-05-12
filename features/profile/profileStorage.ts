import * as SecureStore from "expo-secure-store";

export type Profile = {
  name: string;
  sport: string;
  goal: string;
};

const PROFILE_KEY = "profile";

function keyForUser(userId: string) {
  return `${PROFILE_KEY}_${userId}`;
}

export async function getProfile(userId: string): Promise<Profile> {
  try {
    const data = await SecureStore.getItemAsync(keyForUser(userId));

    if (data) {
      return JSON.parse(data);
    }

    return {
      name: "",
      sport: "",
      goal: "",
    };
  } catch (error) {
    console.log("Failed to load profile:", error);

    return {
      name: "",
      sport: "",
      goal: "",
    };
  }
}

export async function saveProfile(userId: string, profile: Profile) {
  try {
    await SecureStore.setItemAsync(keyForUser(userId), JSON.stringify(profile));
  } catch (error) {
    console.log("Failed to save profile:", error);
  }
}
