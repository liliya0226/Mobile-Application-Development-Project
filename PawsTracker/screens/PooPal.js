import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Switch, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AddReminder from "../components/AddReminder";
import { auth } from "../firebase-files/firebaseSetup";
import { database } from "../firebase-files/firebaseSetup";
import { useDogContext } from "../context-files/DogContext";
import { onSnapshot, collection, updateDoc, doc } from "@firebase/firestore";
import ReminderList from "../components/ReminderList";
import  { cancelNotification, scheduleNotification } from "../components/NotificationManager";

export default function PooPal() {
  const [reminders, setReminders] = useState([]);
  const [isAddReminderModalVisible, setAddReminderModalVisible] =
    useState(false);
  const { selectedDog,userLocation } = useDogContext();
 
  useEffect(() => {
    if (selectedDog) {
      const unsubscribe = onSnapshot(
        collection(
          database,
          "users",
          auth.currentUser.uid,
          "dogs",
          selectedDog.value,
          "reminders"
        ),
        (snapshot) => {
          const updatedReminders = [];
          snapshot.forEach((doc) => {
            updatedReminders.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          setReminders(updatedReminders);
        },
        (error) => {
          console.error("Error fetching reminders:", error);
        }
      );

      return () => unsubscribe();
    }
  }, [selectedDog]);

  const openAddReminderScreen = () => {
    if (!selectedDog) {
      Alert.alert(
        "No Dog Selected",
        "Please select a dog before adding a reminder.",
        [{ text: "OK" }]
      );
    } else {
      setAddReminderModalVisible(true);
    }
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
  };
  const toggleSwitch = async (index) => {
    const updatedReminders = [...reminders];
    updatedReminders[index].isEnabled = !updatedReminders[index].isEnabled;
    setReminders(updatedReminders);

    try {
      const reminderRef = doc(
        database,
        "users",
        auth.currentUser.uid,
        "dogs",
        selectedDog.value,
        "reminders",
        reminders[index].id
      );
      await updateDoc(reminderRef, {
        isEnabled: updatedReminders[index].isEnabled,
      });
      // Schedule or cancel notification based on switch state
      if (updatedReminders[index].isEnabled) {
        // Schedule notification if switch is turned on
        await scheduleNotification(updatedReminders[index], userLocation);
      } else {
        // Cancel notification if switch is turned off
        await cancelNotification(updatedReminders[index]);
        
      }
    } catch (error) {
      console.error("Error updating reminder:", error);
    }
  };

  const closeAddReminderScreen = () => {
    setAddReminderModalVisible(false);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Potty Reminder</Text>
        <Pressable style={styles.addButton} onPress={openAddReminderScreen}>
          <Ionicons name="add-circle-outline" size={35} color="black" />
        </Pressable>
      </View>
      <ReminderList
        reminders={reminders}
        formatTime={formatTime}
        toggleSwitch={toggleSwitch}
      />

      <AddReminder
        isVisible={isAddReminderModalVisible}
        onClose={closeAddReminderScreen}
      />
    </View>
  );
}
const styles = StyleSheet.create({
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
  },
  groupContainer: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "black",
    marginBottom: 20,
  },
  switch: {
    transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
  },
  reminderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 20,
    marginBottom: 20,
  },
  timeAndDaysContainer: {
    justifyContent: "center",
  },
  time: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  days: {
    fontSize: 16,
  },
});
