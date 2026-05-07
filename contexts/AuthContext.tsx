import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { removeFcmTokenForCurrentDevice } from "../utils/saveFcmToken";

const firebaseConfig = {
  apiKey: "AIzaSyCWkysqGzqlLHbzNNIHHXwvAJc7Mw786vc",
  authDomain: "my-mobile-app-c9b3f.firebaseapp.com",
  projectId: "my-mobile-app-c9b3f",
  storageBucket: "my-mobile-app-c9b3f.firebasestorage.app",
  messagingSenderId: "836954927083",
  appId: "1:836954927083:web:9d4b2c6b045bfb44ae33ae",
  measurementId: "G-Z9H3ZQTE6D",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// Long-polling improves reliability on Android emulators (e.g., LDPlayer)
// where Firestore's default streaming transport can stall.
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      login: async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
      },
      register: async (email: string, password: string) => {
        await createUserWithEmailAndPassword(auth, email, password);
      },
      logout: async () => {
        const uid = auth.currentUser?.uid;
        if (uid) {
          await removeFcmTokenForCurrentDevice(db, uid);
        }
        await signOut(auth);
      },
    }),
    [loading, user]
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
