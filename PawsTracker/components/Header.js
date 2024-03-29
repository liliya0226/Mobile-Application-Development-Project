import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function Header() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dog Name</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    backgroundColor: "#ff7f50",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
