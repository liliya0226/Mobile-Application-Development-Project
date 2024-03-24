import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { getDocsFromDB } from "../firebase-files/firestoreHelper";

export default function Header({ userId }) {
  const [dogs, setDogs] = useState([]);
  const [selectedDog, setSelectedDog] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  useEffect(() => {
    fetchUserDogs();
  }, []);

  useEffect(() => {
    fetchUserDogs();
  }, [userId]);

  const fetchUserDogs = async () => {
    try {
      const dogsData = await getDocsFromDB(["users", userId, "dogs"]);
      setDogs(
        dogsData.map((dog) => ({ label: dog.name, value: dog.id })) || []
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDogChange = (dogId) => {
    setSelectedDog(dogId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Dog:</Text>
      <DropDownPicker
        open={open}
        value={value}
        items={dogs}
        setOpen={setOpen}
        setValue={setValue}
        onChangeItem={(item) => handleDogChange(item.value)}
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
