import React, { useState, useContext } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { writeToDB } from "../firebase-files/firestoreHelper";
import { auth } from "../firebase-files/firebaseSetup";
import { useDogContext } from "../context-files/ DogContext";

const DayButton = ({ day, isSelected, onSelect }) => (
  <TouchableOpacity
    onPress={() => onSelect(day)}
    style={[styles.dayButton, isSelected && styles.selectedDayButton]}
  >
    <Text style={styles.dayButtonText}>{day}</Text>
  </TouchableOpacity>
);

const AddReminderScreen = ({ isVisible, onClose }) => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const { selectedDog } = useDogContext();
  const toggleDaySelection = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const saveReminder = async () => {

    if (selectedDog) {
      const reminder = {
        time: date.toISOString(),
        days: selectedDays,
        enabled: true,
      };

      try {
        await writeToDB(reminder, [
          "users",
          auth.currentUser.uid,
          "dogs",
          selectedDog.value,
          "reminders",
        ]);

        onClose();
      } catch (error) {
        console.error("Failed to save reminder:", error);
      }
    } else {
      console.error("No selected dog to save the reminder for.");
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showTimepicker = () => {
    setShow(true);
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

          <TouchableOpacity
            onPress={showTimepicker}
            style={styles.timePickerButton}
          >
            <Text style={styles.timePickerText}>
              {date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>

          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onChange}
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

          <TouchableOpacity style={styles.saveButton} onPress={saveReminder}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
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
  modalView: {
    margin: 20,
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
    fontSize: 18,
    color: "black",
  },
  dayButtonsContainer: {
    flexDirection: "row",
    marginBottom: 20,
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
  saveButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#ff7f50",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default AddReminderScreen;
