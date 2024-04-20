import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { writeToDB } from "../firebase-files/firestoreHelper";
import { auth } from "../firebase-files/firebaseSetup";
import { useDogContext } from "../context-files/DogContext";
import { scheduleNotification } from "./NotificationManager";
import button from "../config/button";
import PressableButton from "./PressableButton";
const DayButton = ({ day, isSelected, onSelect }) => (
  <Pressable
    onPress={() => onSelect(day)}
    style={[styles.dayButton, isSelected && styles.selectedDayButton]}
  >
    <Text style={styles.dayButtonText}>{day}</Text>
  </Pressable>
);

const AddReminder = ({ isVisible, onClose }) => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(Platform.OS === "ios"); // iOS always shows the picker
  const [selectedDays, setSelectedDays] = useState([]);
  const [isSaving, setIsSaving] = useState(false); // New state to prevent multiple saves
  const { selectedDog, userLocation } = useDogContext();
  const [showTimePicker, setShowTimePicker] = useState(false);
  useEffect(() => {
    if (isVisible) {
      setDate(new Date());
      setSelectedDays([]); 
    }
  }, [isVisible]); 

  const toggleDaySelection = (day) => {
    setSelectedDays((currentDays) =>
      currentDays.includes(day)
        ? currentDays.filter((d) => d !== day)
        : [...currentDays, day]
    );
  };
  const showTimepicker = () => {
    setShowTimePicker(true);
  };
  const onTimeChange = (event, selectedTime) => {
    const currentMode = Platform.OS === "ios" ? "time" : "date";
    setShowTimePicker(Platform.OS === "ios"); 
    if (selectedTime) {
      setDate(new Date(date.setHours(selectedTime.getHours(), selectedTime.getMinutes())));
    }
  };
  

  const saveReminder = async () => {
    if (isSaving) return; // Prevents additional clicks
    setIsSaving(true); // Disables the button to prevent multiple saves

    if (selectedDog) {
      if (!selectedDays.length) {
        Alert.alert("Please select a date before saving the reminder.");
        setIsSaving(false); // Re-enables the button in case of an error
        return;
      }
      const reminder = {
        time: date.toISOString(),
        days: selectedDays,
        isEnabled: true,
      };

      try {
        onClose();
        const savedReminder = await writeToDB(reminder, [
          "users",
          auth.currentUser.uid,
          "dogs",
          selectedDog.value,
          "reminders",
        ]);

        await scheduleNotification(reminder, userLocation);
        setSelectedDays([]);

        setIsSaving(false);
      } catch (error) {
        console.error("Failed to save reminder:", error);
        setIsSaving(false); // Re-enables the button in case of an error
      }
    } else {
      console.error("No selected dog to save the reminder for.");
      setIsSaving(false); // Re-enables the button if there's no selected dog
    }
  };



  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Add Reminder</Text>

          <Pressable onPress={showTimepicker} style={styles.timePickerButton}>
            <Text style={styles.timePickerText}>{date.toTimeString().substring(0,5)}</Text>
          </Pressable>

          {showTimePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onTimeChange}
            />
          )}

          <View style={styles.dayButtonsContainer}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <DayButton
                key={day}
                day={day}
                isSelected={selectedDays.includes(day)}
                onSelect={toggleDaySelection}
              />
            ))}
          </View>
          <View style={styles.buttonContainer}>
          
            <PressableButton
              customStyle={button.cancelReminderButton}
              onPressFunction={onClose}
              disabled={isSaving} 
            >
              <Text style={button.buttonText}>Cancel</Text>
            </PressableButton>
            <PressableButton
              customStyle={button.saveReminderButton}
              onPressFunction={saveReminder}
              disabled={!date || isSaving}
            >
              <Text style={button.buttonText}>Save</Text>
            </PressableButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
 
  },
  modalView: {
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  timePickerButton: {
    height: 40,
    width: "100%",
    borderWidth: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  timePickerText: {
    fontSize: 16,
    color: "black",
  },
  dayButtonsContainer: {
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 20,
  },
  dayButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "white",
  },
  selectedDayButton: {
    backgroundColor: "#ff7f50",
  },
  dayButtonText: {
    textAlign: "center",
  },

  datePicker: {
    width: "100%",
  },
});

export default AddReminder;
