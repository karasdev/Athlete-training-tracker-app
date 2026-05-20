import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, ScrollView } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/features/auth/AuthContext";
import PrimaryButton from "../components/PrimaryButton";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [favoriteAnimal, setFavoriteAnimal] = useState("");
  const [birthday, setBirthday] = useState("");
  const [personalInfo, setPersonalInfo] = useState("");
  const { register, loading } = useAuth();

  const handleRegister = async () => {
    if (
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim() ||
      !favoriteAnimal.trim() ||
      !birthday.trim() ||
      !personalInfo.trim()
    ) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password should be at least 6 characters");
      return;
    }

    try {
      await register(email.trim(), password, {
        favoriteAnimal: favoriteAnimal.trim(),
        birthday: birthday.trim(),
        personalInfo: personalInfo.trim(),
      });

      Alert.alert("Success", "Account created successfully!");
      router.replace("/");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Registration failed";
      Alert.alert("Registration Failed", message);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Register</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirm your password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
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

      <Text style={styles.label}>Personal info (example: your first school)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter an answer you will remember"
        value={personalInfo}
        onChangeText={setPersonalInfo}
        autoCapitalize="none"
      />

      <PrimaryButton title="Register" onPress={handleRegister} />

      <Text style={styles.link} onPress={() => router.push("/login")}>
        Already have an account? Login here
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
    marginBottom: 30,
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
    color: "#16a34a",
    marginTop: 20,
    fontSize: 16,
  },
});
