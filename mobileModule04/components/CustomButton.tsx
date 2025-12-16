import React from "react";
import { Text, StyleSheet, ViewStyle } from "react-native";
import GradientButton from "./GradientButton";
import { GradientColors } from "@/constants/Colors";

interface CustomButtonProps {
  title: string;
  onPress?: () => void;
  gradient?: keyof typeof GradientColors;
  style?: ViewStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  gradient = "primary",
  style,
}) => {
  return (
    <GradientButton
      onPress={onPress || (() => {})}
      gradient={gradient}
      style={StyleSheet.flatten([styles.button, style])}
      gradientStyle={styles.gradientContent}
    >
      <Text style={styles.text}>{title}</Text>
    </GradientButton>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 327,
    height: 53,
  },
  gradientContent: {
    borderRadius: 6,
    width: "100%",
    height: "100%",
  },
  text: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    textTransform: "capitalize",
  },
});

export default CustomButton;
