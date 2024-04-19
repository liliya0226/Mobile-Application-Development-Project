import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import WeightList from "../components/WeightList";
import { writeToDB } from "../firebase-files/firestoreHelper";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebase-files/firebaseSetup";
import { Pressable } from "react-native";
import { onSnapshot, collection } from "firebase/firestore";
import { database } from "../firebase-files/firebaseSetup";
import { useDogContext } from "../context-files/DogContext";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native";
import { Alert } from "react-native";
import WeightChart from "../components/WeightChart";
export default function Weight() {
  const navigation = useNavigation();
  const [weights, setWeights] = useState([]);
  const { selectedDog } = useDogContext();
  useEffect(() => {
    if (selectedDog) {
      const unsubscribe = onSnapshot(
        collection(
          database,
          "users",
          auth.currentUser.uid,
          "dogs",
          selectedDog.value,
          "weight"
        ),
        (snapshot) => {
          const updatedWeights = [];
          snapshot.forEach((doc) => {
            updatedWeights.push({ id: doc.id, ...doc.data() });
          });
          setWeights(updatedWeights);
        },
        (error) => {
          console.error("Error fetching weights:", error);
        }
      );

      return () => unsubscribe();
    }
  }, [selectedDog]);

  const handleWeightPress = (weight) => {
    navigation.navigate("AddWeight", { weight });
  };

  const handleAddButtonPress = () => {
    if (!selectedDog) {
      Alert.alert(
        "No Dog Selected",
        "Please select a dog before adding a weight.",
        [{ text: "OK" }]
      );
    } else {
      navigation.navigate("AddWeight");
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Weight Tracker</Text>
          <Pressable style={styles.addButton} onPress={handleAddButtonPress}>
            <Ionicons name="add-circle-outline" size={35} color="black" />
          </Pressable>
        </View>
        
        <View style={styles.WeightChart}>
          {weights.length > 0 && selectedDog ? (
            <WeightChart weightData={weights} />
          ) : (
            ""
          )}
        </View>
        <View style={styles.weightData}>
          <WeightList weights={weights} onWeightPress={handleWeightPress} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    // backgroundColor: "white",
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
  WeightChart: {
    // height: 270,
    flex: 3,
    marginBottom: 10,
  },
  weightData: {
    // height: 350,
    flex: 4,
    marginTop: 10,
  },
});
