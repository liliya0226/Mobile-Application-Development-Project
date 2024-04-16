import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

export default function FilterByMonth({
  onFilter,
  resetDropdown,
  setResetDropdown,
}) {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  useEffect(() => {
    if (resetDropdown) {
      setValue(null);
      setResetDropdown(false);
    }
  }, [resetDropdown]);

  const handleMonthSelect = (month) => {
    if (month !== selectedMonth) {
      setSelectedMonth(month);
      onFilter(month);
      //   console.log(month);
    }
  };

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        value={value}
        items={[
          { label: "All", value: null },
          { label: "January", value: "01" },
          { label: "February", value: "02" },
          { label: "March", value: "03" },
          { label: "April", value: "04" },
          { label: "May", value: "05" },
          { label: "June", value: "06" },
          { label: "July", value: "07" },
          { label: "August", value: "08" },
          { label: "September", value: "09" },
          { label: "October", value: "10" },
          { label: "November", value: "11" },
          { label: "December", value: "12" },
        ]}
        setOpen={setOpen}
        setValue={setValue}
        containerStyle={styles.pickerContainer}
        style={styles.picker}
        itemStyle={styles.pickerItem}
        dropDownStyle={styles.dropDown}
        onChangeValue={handleMonthSelect}
        placeholder="Select Month"
        placeholderStyle={styles.placeholder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    zIndex: 2,
  },
  pickerContainer: {
    height: 50,
  },
  picker: {
    height: 50,
  },
  pickerItem: {
    justifyContent: "flex-start",
  },
  dropDown: {
    backgroundColor: "#fafafa",
  },
  placeholder: {
    color: "#808080",
  },
});
