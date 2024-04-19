import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import PressableButton from "./PressableButton"; // Assuming this is the same custom button component used in SignUp
import { useNavigation } from "@react-navigation/native";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-files/firebaseSetup";
import button from "../config/button";
import colors from "../config/colors";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  const signupHandler = () => {
    navigation.replace("Signup");
  };

  const loginHandler = async () => {
    try {
      if (!email || !password) {
        Alert.alert("Fields should not be empty");
        return;
      }
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      // console.log(userCred);
    } catch (err) {
      console.log(err);
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found"
      ) {
        Alert.alert(
          "Error",
          "Incorrect username or password. Please try again."
        );
      } else {
        // Handle other kinds of errors with a generic error message
        Alert.alert(
          "Error",
          "An unexpected error occurred. Please try again later."
        );
      }
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
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />

      <View style={styles.section}>
        <PressableButton
          customStyle={button.loginButton}
          onPressFunction={loginHandler}
        >
          <Text>Login</Text>
        </PressableButton>
        <PressableButton
          customStyle={button.registerButton}
          onPressFunction={signupHandler}
        >
          <Text>New User? </Text>
          <Text>Create An Account</Text>
        </PressableButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "center",
  },
  input: {
    borderColor: colors.black,
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
  },
});
