import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";

export default function PressableButton({
  customStyle,
  onPressFunction,
  children,
  disabled = false,
}) {
  const handlePress = () => {
    if (!disabled) {
      onPressFunction();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.defaultStyle,
        customStyle,
        pressed && styles.pressed,
        disabled && styles.disabled,
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
  disabled: {
    opacity: 0.5,
    backgroundColor: "#ccc", // Change color to indicate disabled state
  },
});
