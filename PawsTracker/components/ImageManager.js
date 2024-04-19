import { View, StyleSheet, Alert, Image } from "react-native";
import React, { useState } from "react";
import PressableButton from "./PressableButton";

import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import colors from "../config/colors";

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
      <PressableButton
        customStyle={styles.cameraButton}
        onPressFunction={takeImageHandler}
      >
        <AntDesign name="camerao" size={24} color={colors.black} />
      </PressableButton>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  cameraButton: {
    backgroundColor: colors.white,
    borderRadius: 25,
    position: "absolute",
    left: 25,
    bottom: 15,
  },
});
