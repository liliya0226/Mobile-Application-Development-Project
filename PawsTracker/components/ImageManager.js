import { View, StyleSheet, Alert, Image } from "react-native";
import React, { useState } from "react";
import PressableButton from "./PressableButton";

import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";

export default function ImageManager({ receiveImageURI }) {
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const [imageUri, setImageUri] = useState("");
  async function verifyPermission() {
    if (status.granted) {
      return true;
    }
    try {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    } catch (err) {
      console.log(err);
    }
  }
  async function takeImageHandler() {
    try {
      const havePermission = await verifyPermission();
      if (!havePermission) {
        Alert.alert("You need to give permission");
        return;
      }

      const results = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
      });
      receiveImageURI(results.assets[0].uri);
      setImageUri(results.assets[0].uri);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <View style={styles.container}>
      <PressableButton onPressFunction={takeImageHandler}>
        <AntDesign name="camerao" size={24} color="black" />
      </PressableButton>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  image: { width: 100, height: 100 },
});
