import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const AddNutri = ({ navigation }) => {

  const handlePress = (selectedCategory) => {
    navigation.navigate("AddNutriDetail", {
      category: selectedCategory,
    });
  };
  const handleBack = () => {
    // navigation code to go back
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <AntDesign name="left" size={24} color="black" />
          </Pressable>
          <Text style={styles.title}>Choose what you would like to log</Text>
        </View>
        <View style={styles.optionsContainer}>
          <Pressable
            style={styles.optionButton}
            onPress={() => handlePress("Dry Food")}
          >
            <View>
              <Image
                style={styles.icon}
                source={require("../assets/dryfood.png")}
              />
            </View>

            <Text style={styles.optionText}>Dry Food</Text>
          </Pressable>
          <Pressable
            style={styles.optionButton}
            onPress={() => handlePress("Wet Food")}
          >
            <View>
              <Image
                style={styles.icon}
                source={require("../assets/wetfood.png")}
              />
            </View>

            <Text style={styles.optionText}>Wet Food</Text>
          </Pressable>
          <Pressable
            style={styles.optionButton}
            onPress={() => handlePress("Home Food")}
          >
            <View>
              <Image
                style={styles.icon}
                source={require("../assets/homefood.png")}
              />
            </View>
            <Text style={styles.optionText}>Home Food</Text>
          </Pressable>

          <Pressable
            style={styles.optionButton}
            onPress={() => handlePress("Raw Diet")}
          >
            <View>
              <Image
                style={styles.icon}
                source={require("../assets/rawdiet.png")}
              />
            </View>
            <Text style={styles.optionText}>Raw Diet</Text>
          </Pressable>

          <Pressable
            style={styles.optionButton}
            onPress={() => handlePress("Medicine")}
          >
            <View>
              <Image
                style={styles.icon}
                source={require("../assets/medicine.png")}
              />
            </View>
            <Text style={styles.optionText}>Medicine</Text>
          </Pressable>

          <Pressable
            style={styles.optionButton}
            onPress={() => handlePress("Other")}
          >
            <View>
              <Image
                style={styles.icon}
                source={require("../assets/other.png")}
              />
            </View>
            <Text style={styles.optionText}>Other</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddNutri;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    width: "100%",
    alignItems: "center", // Centers the title text
    justifyContent: "center", // Centers the header content vertically
    padding: 20,
  },
  backButton: {
    position: "absolute", // Absolute positioning to place the button
    top: 20, // Distance from the top of the header
    left: 10, // Distance from the left of the header
    paddingRight: 15,
    zIndex: 10, // Ensures the button is clickable by bringing it to the front
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  optionsContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  icon: {
    width: 50,
    height: 50,
    margin: 20,
   
  },
  optionButton: {
    width: "45%",
    flexDirection: "column", // Stack the icon and text on top of each other
    alignItems: "center", // Center align items for each optionButton
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: "15%",
  },
  optionText: {
    textAlign: "center", // Center the text
    fontSize: 16,
  },
});
