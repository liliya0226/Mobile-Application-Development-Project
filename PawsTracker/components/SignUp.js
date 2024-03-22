import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import React, { useState } from "react";
import PressableButton from "./PressableButton";
import { writeToDB } from '../firebase-files/firestoreHelper'; 
export default function SignUp({ navigation }) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const toApp = async () => {
    // User data to be saved, and fetch dog data
    const userData = {
      firstName,
      lastName,
      email,
    };
  
    // Define the path segments for storing user information in 'users' collection
    // Assuming writeToDB is designed to automatically generate document IDs within the specified collection
    const pathSegments = ['users'];
  
    try {
      // Save user data to database
      await writeToDB(userData, pathSegments);
  
      // Navigate to the App screen after successful data write
      navigation.navigate("App", { email });
      
      console.log("User information saved successfully");
    } catch (err) {
      console.error("Error saving user information:", err);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text>SignUp</Text>
      <TextInput
        style={styles.input}
        onChangeText={setFirstName}
        value={firstName}
        placeholder="Enter your first name"
      />
      <TextInput
        style={styles.input}
        onChangeText={setLastName}
        value={lastName}
        placeholder="Enter your last name"
      />
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Enter your email"
        keyboardType="email-address"
      />
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
