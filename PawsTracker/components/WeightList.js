import { StyleSheet, Text, View, FlatList, Pressable } from "react-native";
import React from "react";

export default function WeightList({ weights, onWeightPress }) {
  const renderWeightItem = ({ item }) => (
    <Pressable onPress={() => onWeightPress(item)}>
      <View style={styles.weightItem}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {item.date
              ? new Date(item.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Invalid Date: " + item.date}
          </Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{item.record} kg</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <FlatList
      data={weights}
      renderItem={renderWeightItem}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}

const styles = StyleSheet.create({
  weightItem: {
    height: 60,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "red",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  warningSymbol: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  weightText: {
    color: "white",
    fontSize: 16,
  },
  dateContainer: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 5,
  },
  dateText: {
    color: "black",
  },
});