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
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker"; // You must install this package
import { AntDesign } from "@expo/vector-icons";
import { auth } from "../firebase-files/firebaseSetup";
import { writeToDB } from "../firebase-files/firestoreHelper";
import { useDogContext } from "../context-files/DogContext";
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
  const isSaveDisabled = isMedicineCategory
    ? (!medicineName || medicineName.trim() === "") || (!medicineDosage || medicineDosage.trim() === "")
    : (!foodName && (!weight || weight.trim() === "")); // Require either foodName or weight for non-medicine categories

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
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

  const handleSaveNutri = async () => {
    if (selectedDog) {
      // 根据是否为药物类别来保存不同的数据
      let nutriData = {};
      if (isMedicineCategory) {
        // 药物类别保存药物名称、剂量和备注
        nutriData = {
          category: category,
          medicineName: medicineName,
          medicineDosage: medicineDosage,
          notes: notes,
          date: Timestamp.fromDate(date),
        };
      } else {
        // 非药物类别保存食物名称、重量和备注
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
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <AntDesign name="left" size={24} color="black" />
        </Pressable>
        <Text style={styles.title}>{category}</Text>
      </View>
      <View style={styles.content}>
        <Image style={styles.icon} source={imageSource} />

        <DateTimePicker
          value={date}
          mode="datetime"
          display="default"
          onChange={handleDateChange}
        />
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
            onChangeText={setWeight} // This should update weight in the state
            value={weight}
            placeholder="Weight (in grams)"
            keyboardType="numeric"
          />
        )}
        <TextInput
          style={styles.input}
          onChangeText={handleNotesChange}
          value={notes}
          placeholder="Notes"
          multiline
          numberOfLines={4}
        />
        <Pressable
          onPress={handleSaveNutri}
          style={[
            styles.saveButton,
            isSaveDisabled && styles.disabledSaveButton,
          ]}
          disabled={isSaveDisabled}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </View>
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
    fontSize: 20,
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
    textAlignVertical: "top",
    marginTop: 30,
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
    fontSize: 18,
    fontWeight: "bold",
  },
  disabledSaveButton: {
    backgroundColor: "grey",
  },
});

export default AddNutriDetail;
