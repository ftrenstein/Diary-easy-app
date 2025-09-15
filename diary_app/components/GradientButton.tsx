import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GradientColors } from "@/constants/Colors";

interface GradientButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  gradient?: keyof typeof GradientColors;
  style?: ViewStyle;
  gradientStyle?: ViewStyle;
  disabled?: boolean;
}

export default function GradientButton({
  children,
  onPress,
  gradient = "primary",
  style,
  gradientStyle,
  disabled = false,
}: GradientButtonProps) {
  const gradientColors = GradientColors[gradient];

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={gradientColors as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.gradient, gradientStyle]}
      >
        {children}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: "rgba(53, 68, 207, 0.25)",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 30,
  },
  gradient: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
});
