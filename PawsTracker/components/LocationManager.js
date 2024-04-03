import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { API_KEY } from "@env";
import PressableButton from "./PressableButton";
import { addLocationToUserDocument } from "../firebase-files/firestoreHelper";
import { auth } from "../firebase-files/firebaseSetup";

export default function LocationManager() {
  const [status, requestPermission] = Location.useForegroundPermissions();
  const [location, setLocation] = useState(null);
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
  const locateUserHandler = async () => {
    try {
      const havePermission = await verifyPermission();
      if (!havePermission) {
        Alert.alert("You need to give permission");
        return;
      }
      const receivedLocation = await Location.getCurrentPositionAsync();
      setLocation({
        lat: receivedLocation.coords.latitude,
        long: receivedLocation.coords.longitude,
      });
    } catch (err) {
      console.log(err);
    }
  };
  //   useEffect(() => {
  //     const handleAddUserLocation = async (location) => {
  //       try {
  //         await addLocationToUserDocument(auth.currentUser.uid, location);
  //         setLocation(location);
  //       } catch (error) {
  //         console.error("Error uploading profile image:", error);
  //         Alert.alert("Error", "Failed to upload profile image.");
  //       }
  //     };
  //     handleAddUserLocation();
  //   }, [location]);
  return (
    <View>
      {location ? (
        <Image
          style={styles.image}
          source={{
            uri: `https://maps.googleapis.com/maps/api/staticmap?center=${
              location.lat
            },${location.long}&zoom=14&size=${Dimensions.get("window").width}x${
              Dimensions.get("window").height
            }&maptype=roadmap&markers=color:red%7Clabel:L%7C${location.lat},${
              location.long
            }&key=${API_KEY}`,
          }}
        ></Image>
      ) : (
        <PressableButton
          customStyle={styles.locateButton}
          onPressFunction={locateUserHandler}
        >
          <Text>Locate Me</Text>
        </PressableButton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
  },
  locateButton: {
    backgroundColor: "#ff7f50",
  },
});
