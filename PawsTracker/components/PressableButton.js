import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";

export default function PressableButton({
  customStyle,
  onPressFunction,
  children,
}) {
  return (
    <Pressable
      onPress={onPressFunction}
      style={({ pressed }) => [
        styles.defaultStyle,
        customStyle,
        pressed && styles.pressed,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  defaultStyle: {
    borderRadius: 5,
    padding: 5,
    backgroundColor: "#aaa",
  },
  pressed: {
    opacity: 0.5,
  },
});
