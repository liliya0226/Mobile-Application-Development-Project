import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import colors from "../config/colors";

/**
 * Filtered the month for weight record
 * @param {onFilter, resetDropdown, setResetDropdown} get from Weight.js
 */
export default function FilterByMonth({
  onFilter,
  resetDropdown,
  setResetDropdown,
}) {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  //reset the dropdown
  useEffect(() => {
    if (resetDropdown) {
      setValue(null);
      setResetDropdown(false);
    }
  }, [resetDropdown]);

  // filted by month
  const handleMonthSelect = (month) => {
    if (month !== selectedMonth) {
      setSelectedMonth(month);
      onFilter(month);
    }
  };

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        value={value}
        // 12 months as label
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
        onChangeValue={handleMonthSelect}
        placeholder="Select Month"
        placeholderStyle={styles.placeholder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 20,
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
    backgroundColor: colors.dropdowncolor,
  },
  placeholder: {
    color: colors.placeholder,
  },
});
