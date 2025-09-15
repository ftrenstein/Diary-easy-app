import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GradientColors } from "@/constants/Colors";

export default function GradientPreview() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Gradients</Text>

      {Object.entries(GradientColors).map(([key, colors]) => (
        <View key={key} style={styles.gradientRow}>
          <LinearGradient
            colors={colors as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradientPreview}
          />
          <Text style={styles.gradientLabel}>{key}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f3f3f3",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#000",
  },
  gradientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  gradientPreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  gradientLabel: {
    fontSize: 16,
    color: "#000",
    textTransform: "capitalize",
  },
});
