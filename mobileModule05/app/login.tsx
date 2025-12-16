import React from "react";
import { View, StyleSheet } from "react-native";
import Diary from "../assets/images/diarylogo.svg";
import Diarylock from "../assets/images/diarylock.svg";
import CustomButton from "../components/CustomButton";
import { router } from "expo-router";

const LoginScreen = () => {
  const handleLogin = () => {
    router.push("/auth");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
      
        <View style={styles.logoContainer}>
          <Diary width={130} height={46} />
        </View>

       
        <View style={styles.lockContainer}>
          <Diarylock width={282} height={282} />
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton title="Login" onPress={handleLogin} />
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  lockContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
});

export default LoginScreen;
