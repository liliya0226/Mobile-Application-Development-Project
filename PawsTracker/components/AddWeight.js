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
import { FontAwesome } from "@expo/vector-icons";
import colors from "../config/colors";
import button from "../config/button";
import font from "../config/font";

/**
 * Handle add, modify and delete weight record with weight and date.
 * @param { navigation, route } param for modification of weight
 */
export default function AddWeight({ navigation, route }) {
  const [record, setRecord] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [textInputValue, setTextInputValue] = useState("");
  const { selectedDog } = useDogContext();

  // get the weight record if is for modification with route
  useEffect(() => {
    if (route.params?.weight) {
      const { weight } = route.params;
      setRecord(weight.record.toString());
      setDate(new Date(route.params.weight.date));
      setTextInputValue(new Date(route.params.weight.date).toDateString());
    }
  }, [route.params?.weight]);

  // handle add a new weight record
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

  //handle date for datetimepicker
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setTextInputValue(currentDate.toDateString());
  };

  // handle save button with alert
  const handleSave = async () => {
    if (!record || isNaN(Number(record)) || Number(record) <= 0) {
      Alert.alert("Invalid Input", "Please check your input values");
      return;
    }

    Alert.alert("Save Changes", "Are you sure you want to save the changes?", [
      { text: "Cancel", onPress: () => {} },
      { text: "OK", onPress: () => saveChanges() },
    ]);
  };

  // handle save button with add a new record or modify a record
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

  // handle cancel button
  const handleCancel = () => {
    navigation.goBack();
  };

  // handle delete button with existing record
  const handleDelete = async () => {
    if (route.params?.weight) {
      const { weight } = route.params;
      Alert.alert(
        "Delete Weight",
        "Are you sure you want to delete this weight record?",
        [
          { text: "Cancel", onPress: () => {} },
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
      <View style={styles.recordHeader}>
        <Text style={styles.recordHeaderText}>Weight Record</Text>
        {/* show delete button based on if add new record or not */}
        {route.params?.weight ? (
          <View style={styles.deleteButtonContainer}>
            <PressableButton
              customStyle={styles.delete}
              onPressFunction={handleDelete}
            >
              <FontAwesome name="trash-o" size={26} color={colors.black} />
            </PressableButton>
          </View>
        ) : (
          ""
        )}
      </View>
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
          onTouchStart={() => {
            setShowDatePicker(true);
            setTextInputValue(new Date().toDateString());
          }}
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
          customStyle={button.cancelButton}
          onPressFunction={handleCancel}
        >
          <Text style={button.buttonText}>Cancel</Text>
        </PressableButton>
        <PressableButton
          customStyle={button.saveButton}
          onPressFunction={handleSave}
        >
          <Text style={button.buttonText}>Save</Text>
        </PressableButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  section: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.weightRdHeader,
    marginBottom: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  recordHeaderText: {
    fontSize: font.small,
    fontWeight: "bold",
  },
  deleteButtonContainer: {
    marginLeft: "auto",
  },
  delete: {
    backgroundColor: colors.transparent,
  },
  input: {
    height: 40,
    borderColor: colors.black,
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
});
