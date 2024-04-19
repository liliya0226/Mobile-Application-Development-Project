import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { auth } from "../firebase-files/firebaseSetup";
import { useDogContext } from "../context-files/DogContext";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";

import { collection, query, where, onSnapshot } from "firebase/firestore";
import { database } from "../firebase-files/firebaseSetup";
export default function Nutri() {
  const navigation = useNavigation();
  const { selectedDog } = useDogContext();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [nutris, setNutris] = useState([]);
  const displayDate = format(selectedDate, "PPP");
  const onChangeDate = (event, selectedValue) => {
    setDatePickerVisibility(false);
    if (selectedValue) {
      setSelectedDate(selectedValue); // Update only if a date is selected
    }
  };
  const handleConfirm = (date) => {
    setSelectedDate(date);
    setDatePickerVisibility(false);
  };
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const handleToday = () => {
    setSelectedDate(new Date()); // Reset to today's date
  };

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
    if (selectedDog && selectedDog.value) {
      // Convert selectedDate to the start and end of the day for querying
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const nutrisRef = collection(
        database,
        "users",
        auth.currentUser.uid,
        "dogs",
        selectedDog.value,
        "nutris"
      );

      const q = query(
        nutrisRef,
        where("date", ">=", startOfDay),
        where("date", "<=", endOfDay)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const updatedNutris = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
          
            data.date = data.date.toDate();
            updatedNutris.push({ id: doc.id, ...data });
          });
          setNutris(updatedNutris);
  
        },
        (error) => {
          console.error(
            "Error fetching nutritional information for selected date:",
            error
          );
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
      <View style={styles.dateHeader}>
        <Pressable onPress={showDatePicker} style={styles.calendarIcon}>
          <Ionicons name="calendar-outline" size={24} color="black" />
        </Pressable>
        <Text style={styles.dateText}>{displayDate}</Text>
        {isDatePickerVisible && (
          <DateTimePicker
            testID="dateTimePicker"
            value={selectedDate}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}
      </View>
      <FlatList
        data={nutris}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.record}>
            <Image
              source={getCategoryImage(item.category)}
              style={styles.categoryIcon}
            />
            <View style={styles.recordDetails}>
              {item.category !== "Medicine" ? (
                <>
                  <Text style={styles.time}>{format(item.date, "p")}</Text>
                  <Text
                    style={styles.description}
                  >{`${item.foodName} - ${item.weight}`}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.time}>{format(item.date, "p")}</Text>
                  <Text
                    style={styles.description}
                  >{`${item.medicineName} - ${item.medicineDosage}`}</Text>
                </>
              )}
              <Text style={styles.description}>{`${item.notes}`}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          selectedDog ? (
            <Text style={styles.noRecords}>No records for today yet</Text>
          ) : (
            <View style={styles.centerMessage}>
              <Ionicons
                name="paw"
                size={50}
                color="grey"
                style={styles.iconStyle}
              />
              <Text style={styles.selectDogMessage}>
                Please select a dog first
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
    flex: 1,
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
  },
  dateHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  calendarIcon: {
    marginRight: 10,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  calendarIcon: {
    marginRight: 10, // Adds spacing between the icon and the text
  },

  centerMessage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  selectDogMessage: {
    fontSize: 20,
    color: "grey",
    marginTop: 16,
  },
  calendarIcon: {
    marginRight: 10,
    padding: 8, // Padding makes the touch area larger
    borderRadius: 16, // Circular touch area
    backgroundColor: "#f0f0f0", // A slight background color
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Android shadow
    elevation: 5,
  },

  iconStyle: {
    marginBottom: 8,
  },
  record: {
    flexDirection: "row", // Align items horizontally
    padding: 10,
    marginVertical: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    elevation: 1,
    alignItems: "center", // Align items vertically
  },
  categoryIcon: {
    width: 70,
    height: 70,
    marginRight: 30,
    zIndex: 2,
  },
  recordDetails: {
    flex: 1,
  },
  time: {
    fontSize: 16,
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
  noRecords: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
});
