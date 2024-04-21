import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../firebase-files/firebaseSetup";
import { useDogContext } from "../context-files/DogContext";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { database } from "../firebase-files/firebaseSetup";
import NutritionList from "../components/NutritionList";

export default function Nutri() {
  const navigation = useNavigation();
  const { selectedDog } = useDogContext();
  const [nutris, setNutris] = useState([]);

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

    if (selectedDog) {
      const nutrisRef = collection(
        database,
        "users",
        auth.currentUser.uid,
        "dogs",
        selectedDog.value,
        "nutris"
      );

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

      return () => unsubscribe();
    }
  }, [selectedDog]);

  return (

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Daily Nutrition Log</Text>
          <Pressable style={styles.addButton} onPress={handleAddButtonPress}>
            <Ionicons name="add-circle-outline" size={35} color="black" />
          </Pressable>
        </View>
       
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
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
  },
  list: {
    flex: 3,
    marginBottom: 10,
  },

});
