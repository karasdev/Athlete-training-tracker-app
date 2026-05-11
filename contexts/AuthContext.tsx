import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  clearAuth,
  getStoredToken,
  setStoredToken,
  setStoredUser,
  StoredUser,
} from "../utils/authStorage";
import { apiFetch, apiFetchJson } from "../utils/api";
import { removeFcmTokenForCurrentDevice } from "../utils/saveFcmToken";

type AuthContextType = {
  user: StoredUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    recovery: { favoriteAnimal: string; birthday: string; personalInfo: string }
  ) => Promise<void>;
  logout: () => Promise<void>;
};

type AuthResponse = {
  accessToken: string;
  userId: string;
  email: string;
};

type UserMeResponse = {
  userId: string;
  email: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(message)), ms);
    }),
  ]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const token = await withTimeout(
          getStoredToken(),
          3000,
          "Timed out reading stored auth token"
        );
        if (!token) {
          return;
        }

        const me = await withTimeout(
          apiFetchJson<UserMeResponse>("/api/v1/users/me"),
          5000,
          "Timed out checking current user"
        );
        if (!cancelled) {
          setUser({ id: me.userId, email: me.email });
          await setStoredUser({ id: me.userId, email: me.email });
        }
      } catch {
        await clearAuth();
        if (!cancelled) setUser(null);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      login: async (email: string, password: string) => {
        const data = await apiFetchJson<AuthResponse>("/api/v1/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        await setStoredToken(data.accessToken);
        const next = { id: data.userId, email: data.email };
        await setStoredUser(next);
        setUser(next);
      },
      register: async (email, password, recovery) => {
        const data = await apiFetchJson<AuthResponse>("/api/v1/auth/register", {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
            favoriteAnimal: recovery.favoriteAnimal,
            birthday: recovery.birthday,
            personalInfo: recovery.personalInfo,
          }),
        });
        await setStoredToken(data.accessToken);
        const next = { id: data.userId, email: data.email };
        await setStoredUser(next);
        setUser(next);
      },
      logout: async () => {
        await removeFcmTokenForCurrentDevice();
        await clearAuth();
        setUser(null);
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
