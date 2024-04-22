import React from "react";
import { View, Text, Switch, FlatList, StyleSheet } from "react-native";
import font from "../config/font";
import { Ionicons } from "@expo/vector-icons";
import { useDogContext } from "../context-files/DogContext";
import colors from "../config/colors";
// Component for rendering a list of reminders
const ReminderList = ({ reminders, formatTime, toggleSwitch }) => {
  // Get the selected dog from the context
  const { selectedDog } = useDogContext();

  // Function to render each reminder item
  const renderItem = ({ item, index }) => (
    <View style={styles.reminderContainer}>
      <View style={styles.timeAndDaysContainer}>
        {/* Display the time of the reminder */}
        <Text style={styles.time}>{formatTime(item.time)}</Text>
        {/* Display the days of the reminder */}
        <Text style={styles.days}>{item.days.join(", ")}</Text>
      </View>
      {/* Switch to enable/disable the reminder */}
      <Switch
        trackColor={{
          false: colors.trackColorFalse,
          true: colors.trackColorTrue,
        }}
        thumbColor={
          item.isEnabled ? colors.thumbColorEnabled : colors.thumbColorDisabled
        }
        ios_backgroundColor={colors.iosBackgroundColor}
        onValueChange={() => toggleSwitch(index)}
        value={item.isEnabled}
        style={styles.switch}
      />
    </View>
  );

  return (
    <FlatList
      data={reminders}
      renderItem={renderItem}
      // Component to render when the list is empty
      ListEmptyComponent={
        selectedDog ? ( // If a dog is selected
          <Text style={styles.noRecords}>
            No records for {selectedDog.label} yet
          </Text>
        ) : (
          // If no dog is selected
          <View style={styles.centerMessage}>
            {/* Icon for no dog selected */}
            <Ionicons
              name="paw"
              size={50}
              color="grey"
              style={styles.iconStyle}
            />
            {/* Message to select a dog */}
            <Text style={styles.selectDogMessage}>
              Please select a dog first
            </Text>
          </View>
        )
      }
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

// Styles for the ReminderList component
const styles = StyleSheet.create({
  reminderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 20,
    marginBottom: 20,
  },
  timeAndDaysContainer: {
    justifyContent: "center",
  },
  time: {
    fontSize: font.small,
    fontWeight: "bold",
    marginBottom: 5,
  },
  days: {
    fontSize: font.extraSmall,
  },
  switch: {
    transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
  },
  noRecords: {
    fontSize: font.extraSmall,
    color: "#999",
    textAlign: "center",
  },
  centerMessage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  selectDogMessage: {
    fontSize: font.medium,
    color: "grey",
    marginTop: 16,
  },
});

export default ReminderList;
