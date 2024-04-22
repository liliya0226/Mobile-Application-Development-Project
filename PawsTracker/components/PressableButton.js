import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import colors from "../config/colors";

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
    backgroundColor: 'transparent', // Ensure the background is always transparent
  },
  pressed: {
    opacity: 0.2,
    backgroundColor: '#e0e0e0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: colors.dropdowncolor,
  },
});

