import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Modal,
  TextInput,
  Image,
} from "react-native";
import {
  writeToDB,
  getDocsFromDB,
  addImageUrlToUserDocument,
} from "../firebase-files/firestoreHelper";
import { auth, storage } from "../firebase-files/firebaseSetup";
import ImageManager from "../components/ImageManager";
import { ref, uploadBytes } from "firebase/storage";

export default function Profile() {
  const [userInfo, setUserInfo] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    profileImage: "",
  });

  const [dogs, setDogs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dogName, setDogName] = useState("");
  const [dogAge, setDogAge] = useState("");
  const [imageUrl, setImageUrl] = useState("");

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
  }, [auth.currentUser.uid, imageUrl]);

  const handleAddProfileImage = async (imageUri) => {
    try {
      const imageName = imageUri.substring(imageUri.lastIndexOf("/") + 1);
      const imageRef = ref(storage, `profileImages/${imageName}`);
      const response = await fetch(imageUri);
      const imageBlob = await response.blob();
      await uploadBytes(imageRef, imageBlob);
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${imageRef.bucket}/o/profileImages%2F${imageName}?alt=media`;

      await addImageUrlToUserDocument(auth.currentUser.uid, imageUrl);
      setImageUrl(imageUrl);
    } catch (error) {
      console.error("Error uploading profile image:", error);
      Alert.alert("Error", "Failed to upload profile image.");
    }
  };

  const addDog = () => {
    setIsModalVisible(true);
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

    try {
      const newDog = {
        name: dogName.trim(),
        age,
      };

      await writeToDB(newDog, ["users", auth.currentUser.uid, "dogs"]);

      setDogAge("");
      setDogName("");
      fetchDogsData();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error saving dog:", error);
      Alert.alert("Error", "Failed to save dog information.");
    }
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

  return (
    <View style={styles.container}>
      <ImageManager receiveImageURI={handleAddProfileImage}></ImageManager>
      {userInfo.profileImage && (
        <Image
          source={{
            uri: userInfo.profileImage,
          }}
          style={styles.profileImage}
        />
      )}
      <Text>Last Name: {userInfo.lastName}</Text>
      <Text>First Name: {userInfo.firstName}</Text>
      <Text>Email: {userInfo.email}</Text>
      <Button title="Add Dog" onPress={addDog} />
      <View style={styles.dogsContainer}>
        {dogs &&
          dogs.map((dog, index) => (
            <View style={styles.dogContainer} key={index}>
              <Text>Dog Name: {dog.name}</Text>
              <Text>Dog Age: {dog.age}</Text>

              {/* <Image source={{ uri: dog.image }} style={styles.dogImage} /> */}
            </View>
          ))}
      </View>
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContent}>
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
          {/* <ImageManager
            receiveImageURI={(imageUri) => handleAddDogImage(imageUri, dog.id)}
          /> */}
          <Button title="Save" onPress={saveDog} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  dogsContainer: {
    marginTop: 20,
    width: "100%",
  },
  dogContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
  dogImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginVertical: 10,
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 5,
    width: "80%",
  },
});
