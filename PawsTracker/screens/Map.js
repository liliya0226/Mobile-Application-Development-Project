import { StyleSheet, Text, View } from "react-native";
import React from "react";
import LocationManager from "../components/LocationManager";

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
