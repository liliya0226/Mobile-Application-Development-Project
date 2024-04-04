import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Switch, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AddReminder from "../components/AddReminder";
import { getDocsFromDB } from "../firebase-files/firestoreHelper";
import { auth } from "../firebase-files/firebaseSetup";
import { useDogContext } from "../context-files/DogContext";
import { Alert } from "react-native";
export default function PooPal() {
  const [reminders, setReminders] = useState([]);
  const [isAddReminderModalVisible, setAddReminderModalVisible] =
    useState(false);
  const { selectedDog } = useDogContext();

  useEffect(() => {
    const fetchReminders = async () => {
      if (!selectedDog || !selectedDog.value) return;

      try {
        const remindersData = await getDocsFromDB([
          "users",
          auth.currentUser.uid,
          "dogs",
          selectedDog.value,
          "reminders",
        ]);
        setReminders(
          remindersData.map((reminder) => ({ ...reminder, isEnabled: false }))
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchReminders();
  }, [selectedDog]);

  const toggleSwitch = (index) => {
    setReminders((prevReminders) => {
      const updatedReminders = [...prevReminders];
      updatedReminders[index] = {
        ...updatedReminders[index],
        isEnabled: !updatedReminders[index].isEnabled,
      };
      return updatedReminders;
    });
  };

  const showTimePicker = () => {
    console.log("Show time picker!");
  };

  const openAddReminderScreen = () => {
    if (!selectedDog) {
      Alert.alert(
        "No Dog Selected",
        "Please select a dog before adding a weight.",
        [{ text: "OK" }]
      );
    } else {
      setAddReminderModalVisible(true);
    }
  };

  const closeAddReminderScreen = () => {
    setAddReminderModalVisible(false);
  };


  const formatTime = (timeString) => {
    const date = new Date(timeString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Potty Reminder</Text>
        <Pressable style={styles.addButton} onPress={openAddReminderScreen}>
          <Ionicons name="add-circle-outline" size={35} color="black" />
        </Pressable>
      </View>
      {reminders.map((reminder, index) => (
        <View style={styles.reminderContainer} key={index}>
          <View style={styles.timeAndDaysContainer}>
            <Text style={styles.time}>{formatTime(reminder.time)}</Text>
            <Text style={styles.days}>{reminder.days.join(", ")}</Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={reminder.isEnabled ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => toggleSwitch(index)}
            value={reminder.isEnabled}
            style={styles.switch}
          />
        </View>
      ))}

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 20,
    marginBottom: 20,
  },
  timeAndDaysContainer: {

    justifyContent: 'center',
  },
  time: {
    fontSize: 18, 
    fontWeight: 'bold',
    marginBottom: 5, 
  },
  days: {
    fontSize: 16, 
  },
});
