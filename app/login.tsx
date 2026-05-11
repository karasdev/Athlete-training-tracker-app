import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, ScrollView } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import PrimaryButton from "../components/PrimaryButton";
import { registerForPushNotificationsAsync } from "../utils/notifications";
import { saveFcmToken } from "../utils/saveFcmToken";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    try {
      await login(email.trim(), password);

      try {
        const token = await registerForPushNotificationsAsync();
        if (token) {
          console.log("Push token:", token);
          await saveFcmToken(token);
        }
      } catch (notificationError) {
        console.log("Failed to register push notifications:", notificationError);
      }

      router.replace("/");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Login failed";
      Alert.alert("Login Failed", message);
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
      <Text style={styles.title}>Login</Text>

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

      <PrimaryButton title="Login" onPress={handleLogin} />

      <Text style={styles.forgotLink} onPress={() => router.push("/forgot-password")}>
        Forgot password?
      </Text>

      <Text style={styles.link} onPress={() => router.push("/register")}>
        Do not have an account? Register here
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
  },
  forgotLink: {
    textAlign: "center",
    color: "#2563eb",
    marginTop: 4,
    fontSize: 14,
    fontWeight: "700",
  },
});
