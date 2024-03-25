import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import PressableButton from "./PressableButton"; // Assuming you have this component
// Import other necessary components and functions
import { writeToDB } from "../firebase-files/firestoreHelper";
import { createUserWithEmailAndPassword } from "firebase/auth"; // Import createUserWithEmailAndPassword function
import { auth } from "../firebase-files/firebaseSetup"; //

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState(""); // State for the first name
  const [lastName, setLastName] = useState(""); // State for the last name
  const [password, setPassword] = useState(""); // State for the password
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirming the password

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
      console.log(userId);

      // Write user data to the database
      const userData = {
        email,
        firstName,
        lastName,
      };
      await writeToDB(userData, ["users"]);

      // Navigate to the Profile screen and pass the userId as a parameter
      navigation.navigate("App", {
        screen: "Profile",
        params: { userId },
      });
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
    <View style={styles.container}>
      {/* Input field for first name */}
      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />

      {/* Input field for last name */}
      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />

      {/* Input field for email */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      {/* Input field for password */}
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true} // Hide the password input
        value={password}
        onChangeText={setPassword}
      />

      {/* Input field for confirming password */}
      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry={true} // Hide the confirm password input
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Buttons for registering and navigating to login */}
      <View style={styles.section}>
        <PressableButton onPressFunction={signUpHandler}>
          <Text>Register</Text>
        </PressableButton>
        <PressableButton onPressFunction={loginHandler}>
          <Text>Already Registered? Login</Text>
        </PressableButton>
      </View>
    </View>
  );
}

// Styling for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
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
  },
});
