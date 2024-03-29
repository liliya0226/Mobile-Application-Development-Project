import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import PressableButton from "./PressableButton"; // Assuming this is the same custom button component used in SignUp
import { useNavigation } from "@react-navigation/native";
import { fetchUserIdByEmail } from "../firebase-files/firestoreHelper";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  const loginHandler = async () => {
    try {
      const userId = await fetchUserIdByEmail(email);
      if (userId) {
        // Navigate to the Profile screen and pass the userId as a parameter
        navigation.navigate("App", {
          screen: "Profile",
          params: { userId: userId },
        });
      } else {
        // Alert the user if no user is found with the provided email
        Alert.alert(
          "Login Failed",
          "No user found with this email. Please sign up."
        );
      }
    } catch (error) {
      console.error("Login error: ", error);
      Alert.alert(
        "Login Error",
        "An error occurred during login. Please try again."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true} // Hide the password input
        value={password}
        onChangeText={setPassword}
      />

      <View style={styles.section}>
        <PressableButton onPressFunction={loginHandler}>
          <Text>Login</Text>
        </PressableButton>
      </View>
    </View>
  );
}

// Reuse the same styles from your SignUp component for consistency
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderColor: "#552055",
    borderWidth: 2,
    width: "90%",
    margin: 5,
    padding: 5,
  },
  label: {
    marginLeft: 10,
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
  },
});
