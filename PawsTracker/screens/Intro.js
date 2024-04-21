import { StyleSheet, Text, View, Image,Platform,Dimensions } from "react-native";
import React from "react";
import PressableButton from "../components/PressableButton";
import button from "../config/button";
export default function Intro({ navigation }) {
  const toSignUp = () => {
    navigation.navigate("Signup");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("../assets/paws_tracker.gif")}
          style={styles.gifImage}
          resizeMode="contain"
        />
        <Text style={styles.title}>
          PawsTracker: Where Every Paw Print Leads to a Healthier, Happier
          Journey
        </Text>
        <PressableButton onPressFunction={toSignUp} customStyle={button.introSaveButton}>
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
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: Platform.OS === 'ios' ?30:10,
    marginTop: Platform.OS === 'ios' ?30:10,
    color: "white",
  },
 
  gifImage: {
    width: 900, 
    height: Platform.OS === 'ios' ? 650 : 630, // Reduced height for Android
    paddingBottom: 20,
  },
});
