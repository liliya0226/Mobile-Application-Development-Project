import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PressableButton from "./PressableButton";
import { AntDesign } from "@expo/vector-icons";

export default function WeightItem({
  weightObj,
  deleteFunction,
  detailFunction,
}) {
  function deleteHandler() {
    deleteFunction(weightObj.id);
  }
  function goalPressHandler() {
    detailFunction(weightObj);
  }
  return (
    <View>
      <Text style={styles.text}>{weightObj.text}</Text>
      <PressableButton onPressFunction={deleteHandler}>
        <AntDesign name="delete" size={24} color="black" />
      </PressableButton>
      <PressableButton onPressFunction={goalPressHandler}>
        <AntDesign name="right" size={24} color="black" />
      </PressableButton>
    </View>
  );
}

const styles = StyleSheet.create({});
