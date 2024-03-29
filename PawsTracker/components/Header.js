import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useDogContext } from "../context-files/DogContext";

export default function Header() {
  const { dogs, selectedDog, setSelectedDog } = useDogContext();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  useEffect(() => {
    if (selectedDog) {
      setValue(selectedDog.value);
    }
  }, [selectedDog]);

  const handleDogChange = (value) => {
    const dog = dogs.find((d) => d.value === value);
    if (dog) {
      setSelectedDog(dog);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {selectedDog ? `Selected Dog: ${selectedDog.label}` : "Select Dog:"}
      </Text>
      <DropDownPicker
        open={open}
        value={value}
        items={dogs}
        setOpen={setOpen}
        setValue={setValue}
        onChangeValue={handleDogChange}
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownBox}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  dropdownContainer: {
    width: "90%",
    height: 40,
  },
  dropdown: {
    backgroundColor: "#fafafa",
  },
  dropdownBox: {
    backgroundColor: "#fafafa",
  },
});
