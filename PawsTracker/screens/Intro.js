import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  Dimensions,
} from "react-native";
import React from "react";
import PressableButton from "../components/PressableButton";
import button from "../config/button";
import font from "../config/font";
// This function represents the introduction screen of the application.
export default function Intro({ navigation }) {
  // Function to navigate to the sign-up screen
  const toSignUp = () => {
    navigation.navigate("Signup");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Display the PawsTracker logo */}
        <Image
          source={require("../assets/paws_tracker.gif")}
          style={styles.gifImage}
          resizeMode="contain"
        />
        {/* Display the title of the application */}
        <Text style={styles.title}>
          PawsTracker: Where Every Paw Print Leads to a Healthier, Happier
          Journey
        </Text>
        {/* Button to navigate to the sign-up screen */}
        <PressableButton
          onPressFunction={toSignUp}
          customStyle={button.introSaveButton}
        >
          <Text style={button.buttonText}>Get Started</Text>
        </PressableButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ff7f50",

    alignItems: "center",
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  title: {
    fontSize: font.medium,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: Platform.OS === "ios" ? 30 : 10,
    marginTop: Platform.OS === "ios" ? 30 : 10,
    color: "white",
  },

  gifImage: {
    width: 900,
    height: Platform.OS === "ios" ? 650 : 630, // Reduced height for Android
    paddingBottom: 20,
  },
});
