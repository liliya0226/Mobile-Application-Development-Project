import React, { useState } from "react";
import { Timestamp } from "firebase/firestore";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Pressable,
  SafeAreaView,
  Alert,
  Platform,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import font from "../config/font";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AntDesign } from "@expo/vector-icons";
import { auth } from "../firebase-files/firebaseSetup";
import { writeToDB } from "../firebase-files/firestoreHelper";
import { useDogContext } from "../context-files/DogContext";
import button from "../config/button";
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

const AddNutriDetail = ({ route, navigation }) => {
  const { selectedDog } = useDogContext();
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [medicineName, setMedicineName] = useState("");
  const [medicineDosage, setMedicineDosage] = useState("");
  const [foodName, setFoodName] = useState("");
  const { category } = route.params;
  const [weight, setWeight] = useState("");
  const imageSource = getCategoryImage(category);
  const isMedicineCategory = category === "Medicine";
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [showTimePicker, setShowTimePicker] = useState(false);

  const isSaveDisabled = isMedicineCategory
    ? !medicineName ||
      medicineName.trim() === "" ||
      !medicineDosage ||
      medicineDosage.trim() === ""
    : !foodName && (!weight || weight.trim() === ""); // Require either foodName or weight for non-medicine categories

  const handleTimeChange = (event, selectedTime) => {
    if (event.type === "set") {
      // 用户确认了时间选择
      setDate(
        new Date(
          date.setHours(selectedTime.getHours(), selectedTime.getMinutes())
        )
      );
      setShowTimePicker(false); // 关闭时间选择器
    } else if (event.type === "dismissed") {
      // 用户取消了时间选择
      setShowTimePicker(false); // 关闭时间选择器
    }
  };

  const showTimepicker = () => {
    setShowTimePicker(true);
  };
  const handleBack = () => {
    navigation.goBack();
  };
  const handleNotesChange = (text) => {
    if (text.length > 20) {
      // If the text is longer than 20 characters, show an alert
      Alert.alert("Notes cannot exceed 20 characters.");
    } else {
      setNotes(text);
    }
  };
  const handleDateChange = (event, selectedDate) => {
    if (event.type === "set") {
      setDate(selectedDate);
      setShowDatePicker(false);
    } else if (event.type === "dismissed") {
      setShowDatePicker(false);
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };
  const handleSaveNutri = async () => {
    if (selectedDog) {
      let nutriData = {};
      if (isMedicineCategory) {
        nutriData = {
          category: category,
          medicineName: medicineName,
          medicineDosage: medicineDosage,
          notes: notes,
          date: Timestamp.fromDate(date),
        };
      } else {
        nutriData = {
          category: category,
          foodName: foodName,
          weight: weight,
          notes: notes,
          date: Timestamp.fromDate(date),
        };
      }

      try {
        await writeToDB(nutriData, [
          "users",
          auth.currentUser.uid,
          "dogs",
          selectedDog.value,
          "nutris",
        ]);
        navigation.navigate("Nutri");
      } catch (error) {
        console.error("Failed to save nutritional information:", error);
      }
    } else {
      console.error("No selected dog to save the nutritional information for.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <AntDesign name="left" size={24} color="black" />
        </Pressable>
        <Text style={styles.title}>{category}</Text>
      </View>
      <ScrollView>
      <View style={styles.content}>
        <Image style={styles.icon} source={imageSource} />
      
        <TouchableWithoutFeedback onPress={showDatepicker}>
          <View style={[styles.input, styles.inputPressable]}>
            <Text style={styles.inputText}>{date.toDateString()}</Text>
          </View>
        </TouchableWithoutFeedback>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "default"}
            is24Hour={true}
            onChange={handleDateChange}
            maximumDate={new Date(2300, 10, 20)}
            minimumDate={new Date(1950, 0, 1)}
          />
        )}
        <TouchableWithoutFeedback onPress={showTimepicker}>
          <View style={[styles.input, styles.inputPressable]}>
            <Text style={styles.inputText}>{date.toLocaleTimeString()}</Text>
          </View>
        </TouchableWithoutFeedback>
        {showTimePicker && (
          <DateTimePicker
            value={date}
            mode="time"
            display="inline"
            onChange={handleTimeChange}
          />
        )}
        {isMedicineCategory && (
          <>
            <TextInput
              style={styles.input}
              onChangeText={setMedicineName}
              value={medicineName}
              placeholder="Medicine Name"
            />
            <TextInput
              style={styles.input}
              onChangeText={setMedicineDosage}
              value={medicineDosage}
              placeholder="Dosage (e.g., 500mg)"
            />
          </>
        )}
        {!isMedicineCategory && (
          <TextInput
            style={styles.input}
            onChangeText={setFoodName}
            value={foodName}
            placeholder="Name"
          />
        )}
        {!isMedicineCategory && (
          <TextInput
            style={styles.input}
            onChangeText={setWeight}
            value={weight}
            placeholder="Weight (e.g., 500g)"
            keyboardType="numeric"
          />
        )}
        <TextInput
          style={styles.input}
          onChangeText={handleNotesChange}
          value={notes}
          placeholder="Notes"
          numberOfLines={4}
        />
        <Pressable
          onPress={handleSaveNutri}
          style={[
            button.saveButton,
            isSaveDisabled && button.disabledSaveButton,
          ]}
          disabled={isSaveDisabled}
        >
          <Text style={button.buttonText}>Save</Text>
        </Pressable>
      </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: 10,
    zIndex: 1,
  },
  title: {
    fontSize: font.medium,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  icon: {
    width: 100,
    height: 100,
    margin: 20,
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    fontSize: font.small,
    lineHeight: 20,
    height: 50,
    textAlignVertical: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  saveButton: {
    marginTop: 30,
    backgroundColor: "black",
    padding: 15,
    borderRadius: 5,
    width: "100%",
  },
  saveButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: font.small,
    fontWeight: "bold",
  },
  disabledSaveButton: {
    backgroundColor: "grey",
  },
  inputPressable: {
    width: "100%",
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    textAlignVertical: "center",
    marginTop: 10,
  },
  inputText: {
    fontSize: font.small,
  },
  container: {
    flex: 1,
  },
});

export default AddNutriDetail;
