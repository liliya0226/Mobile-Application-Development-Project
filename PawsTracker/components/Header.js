import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useDogContext } from "../context-files/DogContext";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native";
import { Pressable } from "react-native";
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
  const toggleDropdown = () => {
    setOpen(!open);
  };

  return (
    <SafeAreaView>
      <Pressable onPress={toggleDropdown} style={styles.container}>
        <MaterialCommunityIcons
          name="dog"
          size={40}
          color="black"
          style={styles.icon}
        />
        <DropDownPicker
          open={open}
          value={value}
          items={dogs.map((dog) => ({ label: dog.label, value: dog.value }))}
          setOpen={setOpen}
          setValue={setValue}
          onChangeValue={handleDogChange}
          labelStyle={styles.dropdownLabel}
          containerStyle={styles.dropdownContainer}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownBox}
          arrowIconStyle={styles.dropdownArrow}
          placeholder="Select Dog"
          placeholderStyle={styles.dropdownPlaceholder}
          listItemContainerStyle={styles.listItemContainer}
          listMode="SCROLLVIEW"
          scrollViewProps={{
            nestedScrollEnabled: true,
          }}
        />
        <AntDesign name="down" size={35} color="black" style={styles.icon} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: "center",
    backgroundColor: "#FFA07A",
  },
  icon: {
    width: 40,
    height: 40,
  },
  dropdownContainer: {
    width: 150,
    textAlign: "center",
  },
  dropdownLabel: {
    fontSize: 25,
    textAlign: "center",
  },
  dropdown: {
    backgroundColor: "transparent", // Makes the dropdown transparent
    borderWidth: 0,
    textAlign: "center",
  },
  dropdownBox: {
    borderColor: "#000",
  },
  dropdownArrow: {
    display: "none",
  },
  dropdownPlaceholder: {
    color: "black",
    fontSize: 25,
    textAlign: "center",
  },
  title: {
    display: "none",
  },

});
