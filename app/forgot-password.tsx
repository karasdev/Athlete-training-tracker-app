import { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { router } from "expo-router";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import SHA256 from "crypto-js/sha256";
import PrimaryButton from "../components/PrimaryButton";
import { db } from "../contexts/AuthContext";

function normalizeAnswer(value: string) {
  return value.trim().toLowerCase();
}

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [favoriteAnimal, setFavoriteAnimal] = useState("");
  const [birthday, setBirthday] = useState("");
  const [personalInfo, setPersonalInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const emailLower = useMemo(() => email.trim().toLowerCase(), [email]);

  async function handleVerifyAndSendReset() {
    if (!emailLower || !favoriteAnimal.trim() || !birthday.trim() || !personalInfo.trim()) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    setSubmitting(true);
    try {
      const usersQ = query(collection(db, "users"), where("email", "==", emailLower));
      const snap = await getDocs(usersQ);
      if (snap.empty) {
        Alert.alert("Not found", "No account found for that email.");
        return;
      }

      const userDoc = snap.docs[0];
      const recovery = (userDoc.get("recovery") ?? {}) as {
        favoriteAnimalHash?: string;
        birthdayHash?: string;
        personalInfoHash?: string;
      };

      const favHash = SHA256(normalizeAnswer(favoriteAnimal)).toString();
      const bdayHash = SHA256(normalizeAnswer(birthday)).toString();
      const infoHash = SHA256(normalizeAnswer(personalInfo)).toString();

      const ok =
        recovery.favoriteAnimalHash === favHash &&
        recovery.birthdayHash === bdayHash &&
        recovery.personalInfoHash === infoHash;

      if (!ok) {
        Alert.alert("Verification failed", "Your recovery answers do not match.");
        return;
      }

      await sendPasswordResetEmail(getAuth(), emailLower);
      Alert.alert(
        "Email sent",
        "We sent a password reset email. Please check your inbox (and spam)."
      );
      router.replace("/login");
    } catch (error: any) {
      Alert.alert("Failed", error?.message ?? "Failed to send password reset email.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Forgot password</Text>
      <Text style={styles.subtitle}>
        Verify your recovery info, then we’ll send a reset email.
      </Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.sectionTitle}>Account recovery</Text>

      <Text style={styles.label}>Favorite animal</Text>
      <TextInput
        style={styles.input}
        placeholder="Example: cat"
        value={favoriteAnimal}
        onChangeText={setFavoriteAnimal}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Birthday</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={birthday}
        onChangeText={setBirthday}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Personal info</Text>
      <TextInput
        style={styles.input}
        placeholder="Example: your first school"
        value={personalInfo}
        onChangeText={setPersonalInfo}
        autoCapitalize="none"
      />

      <PrimaryButton
        title={submitting ? "Sending..." : "Send reset email"}
        onPress={handleVerifyAndSendReset}
      />

      <Text style={styles.link} onPress={() => router.replace("/login")}>
        Back to login
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    justifyContent: "center",
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 24,
    fontSize: 14,
    fontWeight: "600",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginTop: 10,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  link: {
    textAlign: "center",
    color: "#2563eb",
    marginTop: 20,
    fontSize: 16,
    fontWeight: "700",
  },
});

