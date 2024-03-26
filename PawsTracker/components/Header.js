import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { getDocsFromDB } from "../firebase-files/firestoreHelper";
import { auth } from "../firebase-files/firebaseSetup";
export default function Header() {
  const [dogs, setDogs] = useState([]);
  const [selectedDog, setSelectedDog] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  useEffect(() => {
    fetchUserDogs();
  }, []);

  useEffect(() => {
    fetchUserDogs();
  }, [auth.currentUser.uid]);

  const fetchUserDogs = async () => {
    try {
      const dogsData = await getDocsFromDB(["users", auth.currentUser.uid, "dogs"]);
      setDogs(
        dogsData.map((dog) => ({ label: dog.name, value: dog.id })) || []
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDogChange = (dogId) => {
    // Find the corresponding dog object by dogId from the dogs array
    const selectedDogData = dogs.find(dog => dog.value === dogId);
    setSelectedDog(selectedDogData ? selectedDogData.label : null); // Update the selectedDog state to the dog's name
    setValue(dogId); // Update the dropdown's value to reflect the selection
  };

  return (
    <View style={styles.container}>
      {/* Display the selected dog's name */}
      <Text style={styles.title}>{selectedDog ? `Selected Dog: ${selectedDog}` : "Select Dog:"}</Text>
      <DropDownPicker
        open={open}
        value={value}
        items={dogs}
        setOpen={setOpen}
        setValue={setValue}
        onChangeValue={(value) => handleDogChange(value)} // Note the use of onChangeValue to properly handle the change in selected value
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    backgroundColor: "#ff7f50",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
