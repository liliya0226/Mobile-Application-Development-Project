import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  SafeAreaView,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import PressableButton from "./PressableButton";
import colors from "../config/colors";
import font from "../config/font";
export default function WeightList({ weights, onWeightPress }) {
  const sortedWeights = weights
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  const renderWeightItem = ({ item }) => (
    <View style={styles.weightItem}>
      <Text style={styles.dateText}>
        {item.date
          ? new Date(item.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          : "Invalid Date: " + item.date}
      </Text>
      <Text style={styles.weightText}>{item.record} kg</Text>
      <PressableButton
        customStyle={styles.arrow}
        onPressFunction={() => onWeightPress(item)}
      >
        <Ionicons
          name="chevron-forward-outline"
          size={24}
          color={colors.black}
        />
      </PressableButton>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={sortedWeights}
        renderItem={renderWeightItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  weightItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: colors.black,
    marginBottom: 10,
  },
  dateText: {
    fontSize: font.small,
    fontWeight: "bold",
  },
  weightText: {
    fontSize: font.small,
    fontWeight: "bold",
  },
  arrow: {
    backgroundColor: colors.transparent,
  },
});
