import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import PressableButton from "./PressableButton";

import { createUserWithEmailAndPassword } from "firebase/auth"; // Import createUserWithEmailAndPassword function
import { auth } from "../firebase-files/firebaseSetup"; //
import { writeUserToDB } from "../firebase-files/firestoreHelper";
import button from "../config/button";
import colors from "../config/colors";

/**
 * Singup for new user
 * @param {navigation} navigate between login/signup
 */
export default function SignUp({ navigation }) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState(""); // State for the first name
  const [lastName, setLastName] = useState(""); // State for the last name
  const [password, setPassword] = useState(""); // State for the password
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirming the password

  // sign up for new users
  const signUpHandler = async () => {
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      Alert.alert("Fill in all the fields");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match. Please try again.");
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Extract user ID
      const userId = userCredential.user.uid;

      // Write user data to the database
      const userData = {
        email,
        firstName,
        lastName,
      };
      await writeUserToDB(userId, userData, ["users"]);
    } catch (error) {
      // Handle authentication errors
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Error", "Email is already in use.");
      } else if (error.code === "auth/weak-password") {
        Alert.alert("Error", "Password is too weak.");
      } else {
        Alert.alert("Error", error.message);
      }
    }
  };

  // Handler for navigating to the login screen
  const loginHandler = () => {
    navigation.navigate("Login");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
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
      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <View style={styles.section}>
        <PressableButton
          customStyle={button.registerButton}
          onPressFunction={signUpHandler}
        >
          <Text style={button.buttonText}>Register</Text>
        </PressableButton>
        <PressableButton
          customStyle={button.loginButton}
          onPressFunction={loginHandler}
        >
          <Text style={button.buttonText}>Already Registered? Login</Text>
        </PressableButton>
      </View>
    </KeyboardAvoidingView>
  );
}

// Styling for the component
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
