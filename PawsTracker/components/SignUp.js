import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import PressableButton from "./PressableButton"; // Assuming you have this component
// Import other necessary components and functions
import { writeToDB } from "../firebase-files/firestoreHelper";
export default function SignUp({ navigation }) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState(""); // State for the first name
  const [lastName, setLastName] = useState(""); // State for the last name
  const [password, setPassword] = useState(""); // State for the password
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirming the password

  const signUpHandler = async () => {
    // Check if passwords match
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match. Please try again."); // Alert the user if passwords do not match
      return; // Stop the function if there is a mismatch
    }

    // Continue with the signup process if passwords match
    const userData = {
      email,
      firstName,
      lastName,
    };
    const pathSegments = ["users"]; // Define the path segments for your database structure

    try {
      const docRef = await writeToDB(userData, pathSegments); // Attempt to write user data to the database
      const userId = docRef.id; // Extract the userId from the document reference

      // Navigate to the Profile screen and pass the userId as a parameter
      navigation.navigate("App", {
        screen: "Profile",
        params: { userId: userId },
      });
    } catch (error) {
      console.error("Error signing up: ", error); // Log any errors for debugging
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
