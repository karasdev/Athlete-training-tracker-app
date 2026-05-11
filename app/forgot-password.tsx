import { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { router } from "expo-router";
import PrimaryButton from "../components/PrimaryButton";
import { apiFetch, throwIfNotOk } from "../utils/api";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [favoriteAnimal, setFavoriteAnimal] = useState("");
  const [birthday, setBirthday] = useState("");
  const [personalInfo, setPersonalInfo] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const emailLower = useMemo(() => email.trim().toLowerCase(), [email]);

  async function handleReset() {
    if (
      !emailLower ||
      !favoriteAnimal.trim() ||
      !birthday.trim() ||
      !personalInfo.trim() ||
      !newPassword.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password should be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiFetch("/api/v1/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email: emailLower,
          favoriteAnimal: favoriteAnimal.trim(),
          birthday: birthday.trim(),
          personalInfo: personalInfo.trim(),
          newPassword,
        }),
      });
      await throwIfNotOk(res);
      Alert.alert("Success", "Your password has been updated. You can log in now.");
      router.replace("/login");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to reset password.";
      Alert.alert("Failed", message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Forgot password</Text>
      <Text style={styles.subtitle}>
        Verify your recovery info, then choose a new password.
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

      <Text style={styles.sectionTitle}>New password</Text>

      <Text style={styles.label}>New password</Text>
      <TextInput
        style={styles.input}
        placeholder="At least 6 characters"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />

      <Text style={styles.label}>Confirm new password</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirm password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <PrimaryButton title={submitting ? "Updating..." : "Update password"} onPress={handleReset} />

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
