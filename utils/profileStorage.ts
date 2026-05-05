import AsyncStorage from "@react-native-async-storage/async-storage";

export type Profile = {
  name: string;
  sport: string;
  goal: string;
};

const PROFILE_KEY = "profile";

export async function getProfile(): Promise<Profile> {
  try {
    const data = await AsyncStorage.getItem(PROFILE_KEY);

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
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.log("Failed to save profile:", error);
  }
}