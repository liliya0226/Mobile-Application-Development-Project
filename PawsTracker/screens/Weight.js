import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import WeightList from "../components/WeightList";
import { getDocsFromDB, writeToDB } from "../firebase-files/firestoreHelper";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebase-files/firebaseSetup";
import PressableButton from "../components/PressableButton";
import { onSnapshot, collection } from "firebase/firestore";
import { database } from "../firebase-files/firebaseSetup";

export default function Weight() {
  const navigation = useNavigation();
  const [weights, setWeights] = useState([]);

  useEffect(() => {
    //TODO: might need update firestorehelper method
    const unsubscribe = onSnapshot(
      collection(
        database,
        "users",
        auth.currentUser.uid,
        "dogs",
        //TODO: use dog id
        "7SEzZmML3X49DZ2TDweX",
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
  }, []);

  const handleWeightPress = (weight) => {
    navigation.navigate("AddWeight", { weight });
  };

  const handleAddButtonPress = () => {
    navigation.navigate("AddWeight");
  };

  return (
    <View style={styles.container}>
      <PressableButton onPressFunction={handleAddButtonPress}>
        <Text>Add</Text>
      </PressableButton>
      <WeightList weights={weights} onWeightPress={handleWeightPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
});
