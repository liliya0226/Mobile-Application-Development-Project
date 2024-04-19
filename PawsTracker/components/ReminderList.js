import React from "react";
import { View, Text, Switch, FlatList, StyleSheet } from "react-native";

const ReminderList = ({ reminders, formatTime, toggleSwitch }) => {
  const renderItem = ({ item, index }) => (
    <View style={styles.reminderContainer}>
      <View style={styles.timeAndDaysContainer}>
        <Text style={styles.time}>{formatTime(item.time)}</Text>
        <Text style={styles.days}>{item.days.join(", ")}</Text>
      </View>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={item.isEnabled ? "#d4d4d4" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
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
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  days: {
    fontSize: 16,
  },
  switch: {
    transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
  },
});

export default ReminderList;
