import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import PressableButton from "../components/PressableButton";

export default function Intro({ navigation }) {
  const toSignUp = () => {
    // navigation.navigate("Signup");
    navigation.navigate("App");
  };
  return (
    <View style={styles.container}>
      <Text>Intro</Text>
      <PressableButton onPressFunction={toSignUp}>
        <Text>To Sign Up</Text>
      </PressableButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ff7f50",
    justifyContent: "center",
    alignItems: "center",
  },
});
