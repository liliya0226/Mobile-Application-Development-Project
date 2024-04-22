import { StyleSheet, Text, View } from "react-native";
import React from "react";
import LocationManager from "../components/LocationManager";

/**
 * Interative map that could show the current user and nearby dog parks
 */
export default function Map() {
  return (
    <View style={styles.container}>
      <LocationManager></LocationManager>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
