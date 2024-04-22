import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../firebase-files/firebaseSetup";
import { useDogContext } from "../context-files/DogContext";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { database } from "../firebase-files/firebaseSetup";
import NutritionList from "../components/NutritionList";
import font from "../config/font";
import PressableButton from "../components/PressableButton";

export default function Nutri() {
  const navigation = useNavigation();
  const { selectedDog } = useDogContext();
  const [nutris, setNutris] = useState([]);
  // Function to get the image for a specific nutrition category
  const getCategoryImage = (category) => {
    const images = {
      "Dry Food": require("../assets/dryfood.png"),
      "Wet Food": require("../assets/wetfood.png"),
      "Raw Diet": require("../assets/rawdiet.png"),
      "Home Food": require("../assets/homefood.png"),
      Medicine: require("../assets/medicine.png"),
      Other: require("../assets/other.png"),
    };
    return images[category];
  };
  // Handle press on the add button to navigate to the add nutrition screen
  const handleAddButtonPress = () => {
    if (!selectedDog) {
      Alert.alert(
        "No Dog Selected",
        "Please select a dog before adding a nurtrition log.",
        [{ text: "OK" }]
      );
    } else {
      navigation.navigate("AddNutri");
    }
  };
  useEffect(() => {
    // Fetch nutrition logs for the selected dog
    if (selectedDog) {
      const nutrisRef = collection(
        database,
        "users",
        auth.currentUser.uid,
        "dogs",
        selectedDog.value,
        "nutris"
      );
      // Subscribe to changes in nutrition logs
      const unsubscribe = onSnapshot(
        nutrisRef,
        (snapshot) => {
          let updatedNutris = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            data.date = data.date.toDate();
            updatedNutris.push({ id: doc.id, ...data });
          });

          updatedNutris.sort((a, b) => b.date - a.date);

          setNutris(updatedNutris);
        },
        (error) => {
          console.error("Error fetching nutritional information:", error);
        }
      );

      return () => unsubscribe(); // Unsubscribe from snapshot listener when component unmounts
    }
  }, [selectedDog]);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Title for the nutrition log */}
        <Text style={styles.title}>Daily Nutrition Log</Text>
        {/* Button to add new nutrition entry */}
        <PressableButton onPressFunction={handleAddButtonPress}>
          <Ionicons name="add-circle-outline" size={35} color="black" />
        </PressableButton>
      </View>
      {/* Nutrition log list */}
      <View style={styles.list}>
        <NutritionList
          nutris={nutris}
          getCategoryImage={getCategoryImage}
          selectedDog={selectedDog}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 0,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: font.large,
    fontWeight: "bold",
    flex: 1,
  },
  list: {
    flex: 3,
    marginBottom: 10,
  },
});
