import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Modal,
  TextInput,
  Image,
  Alert,
  ImageBackground,
  ScrollView,
  Dimensions,
} from "react-native";
import {
  writeToDB,
  getDocsFromDB,
  addImageUrlToUserDocument,
} from "../firebase-files/firestoreHelper";
import { auth, storage } from "../firebase-files/firebaseSetup";
import ImageManager from "../components/ImageManager";
import { ref, uploadBytes } from "firebase/storage";
import PressableButton from "../components/PressableButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import profileBack from "../assets/profileback.jpg";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import button from "../config/button";

export default function Profile({ navigation }) {
  const [userInfo, setUserInfo] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    location: [],
    profileImage: "",
  });

  const [dogs, setDogs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dogName, setDogName] = useState("");
  const [dogAge, setDogAge] = useState("");
  const [profileImaUrl, setProfileImaUrl] = useState("");
  const [dogImaUrl, setDogImaUrl] = useState("");
  const [dogImageUri, setDogImageUri] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const fetchAndSetUserData = async () => {
      try {
        const userDataArray = await getDocsFromDB(
          ["users"],
          auth.currentUser.uid
        );
        if (userDataArray.length > 0) {
          const userData = userDataArray[0];
          setUserInfo({
            id: userData.id,
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            location: userData.location || [],
            profileImage: userData.profileImage || "",
          });
        }

        const dogsData = await getDocsFromDB([
          "users",
          auth.currentUser.uid,
          "dogs",
        ]);
        setDogs(dogsData || []);
      } catch (error) {
        console.error(error);
      }
    };

    if (auth.currentUser.uid) {
      fetchAndSetUserData();
    }
  }, [auth.currentUser.uid, profileImaUrl]);

  const handleAddProfileImage = async (imageUri) => {
    try {
      const imageName = imageUri.substring(imageUri.lastIndexOf("/") + 1);
      const imageRef = ref(storage, `profileImages/${imageName}`);
      const response = await fetch(imageUri);
      const imageBlob = await response.blob();
      await uploadBytes(imageRef, imageBlob);
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${imageRef.bucket}/o/profileImages%2F${imageName}?alt=media`;

      await addImageUrlToUserDocument(auth.currentUser.uid, imageUrl);
      setProfileImaUrl(imageUrl);
    } catch (error) {
      console.error("Error uploading profile image:", error);
      Alert.alert("Error", "Failed to upload profile image.");
    }
  };

  const addDog = () => {
    setIsModalVisible(true);
  };

  const handleAddDogImage = async (imageUri) => {
    try {
      setDogImageUri(imageUri);
      const imageName = imageUri.substring(imageUri.lastIndexOf("/") + 1);
      const imageRef = ref(storage, `dogImages/${imageName}`);
      const response = await fetch(imageUri);
      const imageBlob = await response.blob();
      await uploadBytes(imageRef, imageBlob);
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${imageRef.bucket}/o/dogImages%2F${imageName}?alt=media`;
      setDogImaUrl(imageUrl);
      return imageUrl;
    } catch (error) {
      console.error("Error uploading dog image:", error);
      Alert.alert("Error", "Failed to upload dog image.");
    }
  };

  const saveDog = async () => {
    if (!dogName.trim() || dogName.length > 20) {
      Alert.alert(
        "Validation Error",
        "Dog's name cannot be empty or exceed 20 characters."
      );
      return;
    }

    const age = parseInt(dogAge, 10);
    if (isNaN(age) || age < 0 || age > 20) {
      Alert.alert(
        "Validation Error",
        "Dog's age must be a non-negative number within a reasonable range (0-20)."
      );
      return;
    }
    if (!dogImageUri) {
      Alert.alert("Error", "Your dog need its picture!");
      return;
    }

    try {
      const dogImageUrl = await handleAddDogImage(dogImageUri);
      const newDog = {
        name: dogName.trim(),
        age,
        dogImage: dogImageUrl,
      };

      await writeToDB(newDog, ["users", auth.currentUser.uid, "dogs"]);

      // console.log("Dog uploaded successfully");
      setDogAge("");
      setDogName("");
      setDogImaUrl("");
      setDogImageUri("");
      fetchDogsData();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error saving dog:", error);
      Alert.alert("Error", "Failed to save dog information.");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const fetchDogsData = async () => {
    const dogsData = await getDocsFromDB([
      "users",
      auth.currentUser.uid,
      "dogs",
    ]);
    setDogs(dogsData || []);
  };

  useEffect(() => {
    if (auth.currentUser.uid) {
      fetchDogsData();
    }
  }, [auth.currentUser.uid]);

  const locateUserHandler = () => {
    navigation.navigate("Map");
  };

  useEffect(() => {
    const getAdress = async () => {
      try {
        if (
          userInfo.location &&
          typeof userInfo.location.latitude === "number" &&
          typeof userInfo.location.longitude === "number"
        ) {
          const [location] = await Location.reverseGeocodeAsync({
            latitude: userInfo.location.latitude,
            longitude: userInfo.location.longitude,
          });

          setAddress(location);
        }
        // console.log(location);
      } catch (error) {
        console.error("Error getting address:", error);
      }
    };

    getAdress();
  }, [userInfo.location]);

  return (
    <View style={styles.container}>
      <ImageBackground source={profileBack} style={styles.profileBack}>
        <PressableButton
          customStyle={styles.logout}
          onPressFunction={() => {
            try {
              signOut(auth);
            } catch (err) {
              console.log(err);
            }
          }}
        >
          <AntDesign name="logout" size={30} color="black" />
        </PressableButton>
        <View style={styles.profileSection}>
          <View style={styles.profileImage}>
            {userInfo.profileImage ? (
              <Image
                source={{
                  uri: userInfo.profileImage,
                }}
                style={styles.profileImage}
              />
            ) : (
              <MaterialCommunityIcons
                name="account-circle-outline"
                color="gray"
                size={150}
                // style={styles.iconWithBorder}
              />
            )}
          </View>
          <ImageManager receiveImageURI={handleAddProfileImage}></ImageManager>
          <Text style={styles.name}>
            {userInfo.lastName + "  "}
            {userInfo.firstName}
          </Text>
          <Text style={styles.email}> {userInfo.email}</Text>
          <PressableButton
            customStyle={styles.location}
            onPressFunction={locateUserHandler}
          >
            <Ionicons name="location-outline" size={20} color="black" />
            {address ? (
              <Text>
                {address.city}, {address.country}
              </Text>
            ) : (
              <Text>Get My Location</Text>
            )}
          </PressableButton>
        </View>
      </ImageBackground>

      <View style={styles.bottomContainer}>
        <View style={styles.addDogSection}>
          <Text style={{ fontSize: 20 }}>Add Your Dogs: </Text>
          <PressableButton
            customStyle={styles.addDogButton}
            onPressFunction={addDog}
          >
            <Ionicons name="add-circle-outline" size={30} color="black" />
          </PressableButton>
        </View>
        <ScrollView contentContainerStyle={styles.dogSection}>
          {dogs &&
            dogs.map((dog, index) => (
              <View style={styles.dogContainer} key={index}>
                <Image source={{ uri: dog.dogImage }} style={styles.dogImage} />
                <Text>Dog Name: {dog.name}</Text>
                <Text>Dog Age: {dog.age}</Text>
              </View>
            ))}
        </ScrollView>
        <Modal visible={isModalVisible} animationType="slide">
          <View style={styles.modalContent}>
            <View style={styles.addDogImage}>
              {dogImaUrl ? (
                <Image
                  source={{
                    uri: dogImaUrl,
                  }}
                  style={styles.addDogImage}
                />
              ) : (
                <MaterialCommunityIcons
                  name="dog"
                  color="gray"
                  size={150}
                  style={styles.iconWithBorder}
                />
              )}
            </View>
            <ImageManager receiveImageURI={handleAddDogImage}></ImageManager>
            <TextInput
              style={styles.input}
              placeholder="Dog Name"
              placeholderTextColor="#999"
              value={dogName}
              onChangeText={setDogName}
            />
            <TextInput
              style={styles.input}
              placeholder="Dog Age"
              placeholderTextColor="#999"
              value={dogAge}
              onChangeText={setDogAge}
              keyboardType="numeric"
            />
            <View style={styles.section}>
              <PressableButton
                customStyle={button.cancelButton}
                onPressFunction={handleCancel}
              >
                <Text style={{ color: "white" }}>Cancel</Text>
              </PressableButton>
              <PressableButton
                customStyle={button.saveButton}
                onPressFunction={saveDog}
              >
                <Text style={{ color: "white" }}>Save</Text>
              </PressableButton>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logout: {
    marginTop: 80,
    marginStart: 300,
    backgroundColor: "#FFA07A",
    borderRadius: 25,
    shadowColor: "gray",
    shadowOffset: 10,
    shadowOpacity: 50,
  },
  profileSection: {
    paddingBottom: 30,
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  profileBack: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "cover",
  },

  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderColor: "black",
    marginBottom: 20,
    backgroundColor: "white",
  },
  name: {
    fontSize: 30,
    backgroundColor: "#fffff0",
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginVertical: 2,
    shadowColor: "gray",
    shadowOpacity: 50,
    // borderRadius: 100,
  },
  email: {
    fontSize: 18,
    backgroundColor: "#fffff0",
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginVertical: 2,
    shadowColor: "gray",
    shadowOpacity: 50,
  },
  location: {
    flexDirection: "row",
    fontSize: 18,
    backgroundColor: "#fffff0",
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginVertical: 2,
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
    paddingTop: 20,
  },
  addDogSection: {
    flexDirection: "row",
    justifyContent: "flex-start",
    height: 40,
    alignItems: "center",
    marginLeft: 20,
  },
  addDogButton: {
    backgroundColor: "white",
  },
  dogSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    width: "100%",
  },
  dogContainer: {
    borderWidth: 1,
    borderColor: "#FFA07A",
    backgroundColor: "#FFA07A",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    marginTop: 20,
    marginHorizontal: 20,
    width: Dimensions.get("screen").width > 600 ? "60%" : "40%",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "gray",
    shadowOffset: 10,
    shadowOpacity: 50,
  },
  iconWithBorder: {
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 75,
  },
  dogImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginVertical: 10,
  },
  modalContent: {
    flex: 1,
    paddingTop: 150,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#ffc4ad",
  },

  section: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#696969",
    padding: 10,
    marginVertical: 5,
    width: "80%",
  },
  addDogImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderColor: "white",
    marginBottom: 20,
  },
});
