import React from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react-native";
import { useAuth } from "@/components/AuthContext";
import CustomButton from "../components/CustomButton";

const AuthScreen = () => {
  const { login } = useAuth();

  const handleGoogleAuth = () => {
    console.log("Google authorization");
    // Here will be the logic for Google authorization
    login(); // Авторизуем пользователя
    router.push("/(tabs)");
  };

  const handleGithubAuth = () => {
    console.log("GitHub authorization");
    // Here will be the logic for GitHub authorization
    login(); // Авторизуем пользователя
    router.push("/(tabs)");
  };

  const handleBackToLogin = () => {
    router.back();
  };

  const handleHaveAccount = () => {
    router.push("/login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header and navigation */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBackToLogin}
            style={styles.backButton}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Authorization</Text>
        </View>

        {/* Main content */}
        <View style={styles.mainContent}>
          <Text style={styles.title}>Let's get started!</Text>
          <Text style={styles.description}>Choose account for sign up</Text>

          {/* Authorization buttons */}
          <View style={styles.authButtons}>
            {/* Google */}
            <TouchableOpacity
              style={[styles.authButton, styles.googleButton]}
              onPress={handleGoogleAuth}
            >
              <View style={styles.googleIcon}>
                <IconBrandGoogle size={20} color="#4285f4" />
              </View>
              <Text style={[styles.authButtonText, styles.googleText]}>
                Continue with Google
              </Text>
            </TouchableOpacity>

            {/* GitHub */}
            <TouchableOpacity
              style={[styles.authButton, styles.githubButton]}
              onPress={handleGithubAuth}
            >
              <View style={styles.githubIcon}>
                <IconBrandGithub size={20} color="#fff" />
              </View>
              <Text style={styles.authButtonText}>Continue with GitHub</Text>
            </TouchableOpacity>
          </View>

          {/* Login link */}
          <TouchableOpacity
            onPress={handleHaveAccount}
            style={styles.loginLink}
          >
            <Text style={styles.loginLinkText}>
              <Text style={styles.haveAccount}>Have Account? </Text>
              <Text style={styles.login}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backArrow: {
    fontSize: 24,
    color: "#000",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    color: "#000",
    fontWeight: "400",
    marginRight: 40, // Compensate for back button
  },
  mainContent: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "rgba(0, 0, 0, 0.4)",
    textAlign: "center",
    marginBottom: 60,
  },
  authButtons: {
    width: "100%",
    gap: 16,
  },
  authButton: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderRadius: 6,
    paddingHorizontal: 20,
    position: "relative",
  },
  googleButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dadce0",
  },
  githubButton: {
    backgroundColor: "#24292e",
  },
  googleIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  googleIconText: {
    color: "#4285f4",
    fontSize: 16,
    fontWeight: "bold",
  },
  githubIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  authButtonText: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  googleText: {
    color: "#000",
  },
  loginLink: {
    marginTop: 40,
  },
  loginLinkText: {
    fontSize: 14,
    textAlign: "center",
  },
  haveAccount: {
    color: "rgba(11, 10, 17, 0.4)",
  },
  login: {
    color: "#0063f5",
  },
});

export default AuthScreen;
