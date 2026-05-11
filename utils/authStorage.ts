import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user_json";

export type StoredUser = {
  id: string;
  email: string;
};

export async function getStoredToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setStoredToken(token: string | null): Promise<void> {
  try {
    if (token === null) {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } else {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
  } catch {
    /* ignore */
  }
}

export async function getStoredUser(): Promise<StoredUser | null> {
  try {
    const raw = await SecureStore.getItemAsync(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export async function setStoredUser(user: StoredUser | null): Promise<void> {
  try {
    if (user === null) {
      await SecureStore.deleteItemAsync(USER_KEY);
    } else {
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    }
  } catch {
    /* ignore */
  }
}

export async function clearAuth(): Promise<void> {
  await setStoredToken(null);
  await setStoredUser(null);
}
