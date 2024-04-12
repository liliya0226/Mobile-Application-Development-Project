import React, { useState, useEffect } from "react";
import { StyleSheet, View, Alert, Dimensions } from "react-native";
import { API_KEY } from "@env";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { auth } from "../firebase-files/firebaseSetup";
import { addLocationToUserDocument } from "../firebase-files/firestoreHelper";

export default function DogParkMap() {
  const [userLocation, setUserLocation] = useState(null);
  const [dogParks, setDogParks] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.error("Error fetching user location: ", error);
      }
    })();
  }, []);

  useEffect(() => {
    const fetchNearbyDogParks = async () => {
      if (!userLocation) return;

      try {
        if (userLocation) {
          addLocationToUser(userLocation);
        }
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLocation.latitude},${userLocation.longitude}&radius=3000&type=park&keyword=dog park&key=${API_KEY}`
        );
        const data = await response.json();
        setDogParks(data.results);
        // console.log(response);
        console.log(data.results);
      } catch (error) {
        console.error("Error fetching nearby dog parks: ", error);
      }
    };

    fetchNearbyDogParks();
  }, [userLocation]);

  const addLocationToUser = async (location) => {
    try {
      await addLocationToUserDocument(auth.currentUser.uid, location);
    } catch (error) {
      console.error("Error uploading location info:", error);
    }
  };

  return (
    <View style={styles.container}>
      {userLocation && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Your Location"
            pinColor="blue"
          />

          {dogParks.map((park, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: park.geometry.location.lat,
                longitude: park.geometry.location.lng,
              }}
              title={park.name}
              description={park.vicinity}
              pinColor="green"
            />
          ))}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
  },
});
