import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { Pressable } from "react-native";

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
        <Pressable onPress={toSignUp} style={styles.button}>
        <Text style={styles.buttonText}>Get Started</Text>
      </Pressable>
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 30,
    marginTop: 30,
    color: "white",
  },
  button: {
    backgroundColor: "#4ecdc4", 
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000", 
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  gifImage: {
    width: 700,
    height: 650,
    paddingBottom: 20,
  },
});
