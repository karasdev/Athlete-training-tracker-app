import * as SecureStore from "expo-secure-store";
import { getAuth } from "firebase/auth";

export type Profile = {
  name: string;
  sport: string;
  goal: string;
};

const PROFILE_KEY = "profile";

function getProfileKey() {
  const userId = getAuth().currentUser?.uid;
  return userId ? `${PROFILE_KEY}:${userId}` : PROFILE_KEY;
}

export async function getProfile(): Promise<Profile> {
  try {
    const data = await SecureStore.getItemAsync(getProfileKey());

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

export async function saveProfile(profile: Profile) {
  try {
    await SecureStore.setItemAsync(getProfileKey(), JSON.stringify(profile));
  } catch (error) {
    console.log("Failed to save profile:", error);
  }
}
