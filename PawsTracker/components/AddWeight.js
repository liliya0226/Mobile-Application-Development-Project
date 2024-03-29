import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import PressableButton from "../components/PressableButton";
import {
  writeToDB,
  updateInDB,
  deleteFromDB,
} from "../firebase-files/firestoreHelper";
import { auth } from "../firebase-files/firebaseSetup";
import { useDogContext } from "../context-files/DogContext";
export default function AddWeight({ navigation, route }) {
  const [record, setRecord] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [textInputValue, setTextInputValue] = useState("");
  const { selectedDog } = useDogContext();
  useEffect(() => {
    if (route.params?.weight) {
      const { weight } = route.params;
      setRecord(weight.record.toString());
      setDate(new Date(route.params.weight.date));
      setTextInputValue(new Date(route.params.weight.date).toDateString());
    }
  }, [route.params?.weight]);

  const addWeight = async () => {
    const payload = {
      record: Number(record),
      date: date.toISOString(),
    };

    await writeToDB(payload, [
      "users",
      auth.currentUser.uid,
      "dogs",
      selectedDog.value,
      "weight",
    ]);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setTextInputValue(currentDate.toDateString());
  };

  const handleSave = async () => {
    if (!record || isNaN(Number(record)) || Number(record) <= 0) {
      Alert.alert("Invalid Input", "Please check your input values");
      return;
    }

    Alert.alert("Save Changes", "Are you sure you want to save the changes?", [
      { text: "Cancel", onPress: () => console.log("Cancel Pressed") },
      { text: "OK", onPress: () => saveChanges() },
    ]);
  };

  const saveChanges = async () => {
    try {
      if (route.params?.weight) {
        const { weight } = route.params;
        await updateInDB({ record: Number(record), date: date.toISOString() }, [
          "users",
          auth.currentUser.uid,
          "dogs",
          selectedDog.value,
          "weight",
          weight.id,
        ]);
      } else {
        await addWeight();
      }
    } catch (error) {
      console.error("Error saving weight: ", error);
    }
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleDelete = async () => {
    if (route.params?.weight) {
      const { weight } = route.params;
      Alert.alert(
        "Delete Weight",
        "Are you sure you want to delete this weight record?",
        [
          { text: "Cancel", onPress: () => console.log("Cancel Pressed") },
          {
            text: "OK",
            onPress: async () => {
              await deleteFromDB([
                "users",
                auth.currentUser.uid,
                "dogs",
                selectedDog.value,
                "weight",
                weight.id,
              ]);
              navigation.goBack();
            },
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text>Record *</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={record}
          onChangeText={(text) => setRecord(text)}
        />
      </View>

      <View style={styles.section}>
        <Text>Date *</Text>
        <TextInput
          style={styles.input}
          value={textInputValue}
          editable={false}
          onTouchStart={() => setShowDatePicker(true)}
        />
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="inline"
            onChange={handleDateChange}
          />
        )}
      </View>
      <View style={styles.buttonContainer}>
        <PressableButton
          buttonstyle={styles.delete}
          onPressFunction={handleDelete}
        >
          <Text>Delete</Text>
        </PressableButton>
        <PressableButton
          buttonstyle={styles.cancel}
          onPressFunction={handleCancel}
        >
          <Text>Cancel</Text>
        </PressableButton>
        <PressableButton onPressFunction={handleSave}>
          <Text>Save</Text>
        </PressableButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  section: {
    marginBottom: 20,
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: "green",
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  cancel: {
    backgroundColor: "red",
  },
});