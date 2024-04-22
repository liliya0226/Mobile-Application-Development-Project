import React from "react";
import { StyleSheet, Text, View, Image, Platform } from "react-native";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import font from "../config/font";
import button from "../config/button";
import PressableButton from "./PressableButton";
import colors from "../config/colors";
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
          <View style={styles.buttonWrapper}>
            <PressableButton onPressFunction={handleBack}>
              <AntDesign name="left" size={25} color="black" />
            </PressableButton>
          </View>
          <Text style={styles.title}>Choose what you would like to log</Text>
        </View>
        <View style={styles.optionsContainer}>
          <Pressable
            style={({ pressed }) => [
              button.optionButton,
              pressed ? button.buttonPressed : {},
            ]}
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
            style={({ pressed }) => [
              button.optionButton,
              pressed ? button.buttonPressed : {},
            ]}
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
            style={({ pressed }) => [
              button.optionButton,
              pressed ? button.buttonPressed : {},
            ]}
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
            style={({ pressed }) => [
              button.optionButton,
              pressed ? button.buttonPressed : {},
            ]}
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
            style={({ pressed }) => [
              button.optionButton,
              pressed ? button.buttonPressed : {},
            ]}
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
            style={({ pressed }) => [
              button.optionButton,
              pressed ? button.buttonPressed : {},
            ]}
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
    flexDirection: 'row',    
    alignItems: 'center',  
    width: "100%",
    justifyContent: 'flex-start',
  },
  buttonWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'center', 
    alignItems: 'center',     
    borderRadius: 5,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
    backgroundColor: colors.transparent,
  },
  title: {
    fontSize: font.small,
    fontWeight: "bold",
    flex: 1,
    textAlign: 'center', 
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
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
    paddingRight: 15,
    zIndex: 10,
  },

  optionText: {
    textAlign: "center", // Center the text
    fontSize: font.extraSmall,
  },
});
