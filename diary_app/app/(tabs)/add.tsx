import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AddScreen() {
  // This screen won't be displayed as a tab,
  // but is needed for the tab structure
  return (
    <View style={styles.container}>
      <Text>Add Entry</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
  },
});
