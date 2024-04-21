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
import colors from "../config/colors";
import { useDogContext } from "../context-files/DogContext";
import { EvilIcons } from "@expo/vector-icons";
import font from "../config/font";
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
  const { setUserLocation } = useDogContext();
  const [refreshCount, setRefreshCount] = useState(0);

  //refresh button for refresh location
  const handleRefresh = () => {
    if (!auth.currentUser.uid) {
      return;
    }
    setRefreshCount(refreshCount + 1);
  };

  //re-render page when user update the location and the profile image
  useEffect(() => {
    const fetchAndSetUserData = async () => {
      if (!auth.currentUser.uid) {
        return;
      }
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
        if (auth.currentUser && auth.currentUser.uid) {
          const dogsData = await getDocsFromDB([
            "users",
            auth.currentUser.uid,
            "dogs",
          ]);
          setDogs(dogsData || []);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (auth.currentUser && auth.currentUser.uid) {
      fetchAndSetUserData();
    }
  }, [profileImaUrl, userInfo.location]);

  const handleAddProfileImage = async (imageUri) => {
    if (!auth.currentUser.uid) {
      return;
    }
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
      Alert.alert("Save Dog", "Are you sure you want to save this dog?", [
        { text: "Cancel", onPress: () => console.log("Cancel Pressed") },
        {
          text: "OK",
          onPress: async () => {
            await writeToDB(newDog, ["users", auth.currentUser.uid, "dogs"]);

            setDogAge("");
            setDogName("");
            setDogImaUrl("");
            setDogImageUri("");
            fetchDogsData();
            setIsModalVisible(false);
          },
        },
      ]);
    } catch (error) {
      console.error("Error saving dog:", error);
      Alert.alert("Error", "Failed to save dog information.");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const fetchDogsData = async () => {
    if (auth.currentUser.uid) {
      const dogsData = await getDocsFromDB([
        "users",
        auth.currentUser.uid,
        "dogs",
      ]);
      setDogs(dogsData || []);
    }
  };
  const logoutHandler = async () => {
    try {
      await signOut(auth);
      setUserInfo({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        location: [],
        profileImage: "",
      });
      setDogs([]);
      setUserLocation(null);
      navigation.navigate("Intro");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const locateUserHandler = () => {
    if (auth.currentUser.uid) {
      navigation.navigate("Map");
    }
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
      } catch (error) {
        console.error("Error getting address:", error);
      }
    };

    getAdress();
  }, [refreshCount]);

  return (
    <View style={styles.container}>
      <ImageBackground source={profileBack} style={styles.profileBack}>
        <PressableButton
          customStyle={styles.logout}
          onPressFunction={() => logoutHandler()}
        >
          <AntDesign name="logout" size={30} color={colors.black} />
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
                color={colors.shadow}
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
          <View style={styles.locationAndrefresh}>
            <PressableButton
              customStyle={styles.location}
              onPressFunction={locateUserHandler}
            >
              <Ionicons
                name="location-outline"
                size={20}
                color={colors.black}
              />
              {address ? (
                <Text>
                  {address.city}, {address.country}
                </Text>
              ) : (
                <Text>Get My Location</Text>
              )}
            </PressableButton>
            <PressableButton
              customStyle={styles.refreshButton}
              onPressFunction={handleRefresh}
            >
              <EvilIcons name="refresh" size={20} color={colors.black} />
            </PressableButton>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.bottomContainer}>
        <View style={styles.addDogSection}>
          <Text style={{ fontSize: font.medium }}>Add Your Dogs: </Text>
          <PressableButton
            customStyle={styles.addDogButton}
            onPressFunction={addDog}
          >
            <Ionicons
              name="add-circle-outline"
              size={30}
              color={colors.black}
            />
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
                  color={colors.shadow}
                  size={150}
                  style={styles.iconWithBorder}
                />
              )}
            </View>
            <ImageManager receiveImageURI={handleAddDogImage}></ImageManager>
            <TextInput
              style={styles.input}
              placeholder="Dog Name"
              placeholderTextColor={colors.placeholder}
              value={dogName}
              onChangeText={setDogName}
            />
            <TextInput
              style={styles.input}
              placeholder="Dog Age"
              placeholderTextColor={colors.placeholder}
              value={dogAge}
              onChangeText={setDogAge}
              keyboardType="numeric"
            />
            <View style={styles.section}>
              <PressableButton
                customStyle={button.cancelButton}
                onPressFunction={handleCancel}
              >
                <Text style={{ color: colors.white }}>Cancel</Text>
              </PressableButton>
              <PressableButton
                customStyle={button.saveButton}
                onPressFunction={saveDog}
              >
                <Text style={{ color: colors.white }}>Save</Text>
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
    backgroundColor: colors.bottomTab,
    borderRadius: 25,
    shadowColor: colors.shadow,
    shadowOffset: 10,
    shadowOpacity: 50,
  },
  profileSection: {
    paddingBottom: 30,
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
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
    borderColor: colors.black,
    marginBottom: 20,
    backgroundColor: colors.white,
  },
  name: {
    fontSize: font.extraLarge,
    backgroundColor: colors.profileInfos,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginVertical: 2,
    shadowColor: colors.shadow,
    shadowOpacity: 50,
  },
  email: {
    fontSize: font.small,
    backgroundColor: colors.profileInfos,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginVertical: 2,
    shadowColor: colors.shadow,
    shadowOpacity: 50,
  },
  locationAndrefresh: {
    flexDirection: "row",
  },
  location: {
    flexDirection: "row",
    fontSize: font.small,
    backgroundColor: colors.profileInfos,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginVertical: 2,
  },
  refreshButton: {
    backgroundColor: colors.profileInfos,
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: colors.white,
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
    backgroundColor: colors.white,
  },
  dogSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    width: "100%",
  },
  dogContainer: {
    borderWidth: 1,
    borderColor: colors.header,
    backgroundColor: colors.header,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    marginTop: 20,
    marginHorizontal: 20,
    width: Dimensions.get("screen").width > 600 ? "43%" : "38%",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.shadow,
    shadowOffset: 10,
    shadowOpacity: 50,
  },
  iconWithBorder: {
    borderWidth: 2,
    borderColor: colors.shadow,
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
    backgroundColor: colors.modalColor,
  },

  section: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.shadow,
    padding: 10,
    marginVertical: 5,
    width: "80%",
  },
  addDogImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderColor: colors.white,
    marginBottom: 20,
  },
});
