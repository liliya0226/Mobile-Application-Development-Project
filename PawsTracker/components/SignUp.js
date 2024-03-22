import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PressableButton from "./PressableButton";

export default function SignUp({ navigation }) {
  const toApp = () => {
    navigation.navigate("App");
  };
  return (
    <View style={styles.container}>
      <Text>SignUp</Text>
      <PressableButton onPressFunction={toApp}>
        <Text>To App</Text>
      </PressableButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "",
    justifyContent: "center",
    alignItems: "center",
  },
});
