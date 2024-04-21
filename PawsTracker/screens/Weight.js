import React, { useState, useEffect } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
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
import PressableButton from "../components/PressableButton";
import FilterByMonth from "../components/FilterByMonth";
import colors from "../config/colors";
export default function Weight() {
  const navigation = useNavigation();
  const [weights, setWeights] = useState([]);
  const [filteredWeights, setFilteredWeights] = useState([]);
  const [resetDropdown, setResetDropdown] = useState(false);
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
          setFilteredWeights(updatedWeights);
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
    setResetDropdown(true);
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
      setResetDropdown(true);
    }
  };

  const handleFilterByMonth = (month) => {
    if (!month) {
      setFilteredWeights(weights);
    } else {
      const filtered = weights.filter((weight) => {
        const date = new Date(weight.date);
        const monthPart = date.toISOString().slice(5, 7);
        return monthPart === month;
      });
      setFilteredWeights(filtered);
      // console.log(filtered);
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Weight Tracker</Text>
          <Pressable style={styles.addButton} onPress={handleAddButtonPress}>
            <Ionicons
              name="add-circle-outline"
              size={35}
              color={colors.black}
            />
          </Pressable>
        </View>

        {weights.length > 0 && selectedDog ? (
          <View style={styles.WeightChart}>
            <WeightChart weightData={weights} />
          </View>
        ) : (
          <Text style={styles.noRecords}>No records yet</Text>
        )}

        {weights.length > 0 && selectedDog ? (
          <FilterByMonth
            onFilter={handleFilterByMonth}
            resetDropdown={resetDropdown}
            setResetDropdown={setResetDropdown}
          />
        ) : (
          ""
        )}
        <View style={styles.weightData}>
          <WeightList
            weights={filteredWeights}
            onWeightPress={handleWeightPress}
          />
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
    flex: 3,
    marginBottom: 10,
    padding: 10,
    width: Dimensions.get("screen").width * 0.9,
    height: Dimensions.get("screen").height * 0.3,
  },
  weightData: {
    flex: 4,
    marginTop: 10,
  },
  noRecords: {
    fontSize: 16,
    color: colors.shadow,
    textAlign: "center",
    marginTop: 20,
  },
});
