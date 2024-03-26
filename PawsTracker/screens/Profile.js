import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, Modal, TextInput } from "react-native";
import { writeToDB, getDocsFromDB } from "../firebase-files/firestoreHelper";
import Header from "../components/Header";
import { auth } from "../firebase-files/firebaseSetup";
export default function Profile({ userId }) {
  const [userInfo, setUserInfo] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
  });

  const [dogs, setDogs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dogName, setDogName] = useState("");
  const [dogAge, setDogAge] = useState("");

  useEffect(() => {
    const fetchAndSetUserData = async () => {
      try {
        const userDataArray = await getDocsFromDB(["users"], auth.currentUser.uid);
        if (userDataArray.length > 0) {
    
          const userData = userDataArray[0]; 
          setUserInfo({
            id: userData.id,
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
          });
        }
  
        const dogsData = await getDocsFromDB(["users", auth.currentUser.uid, "dogs"]);
        setDogs(dogsData || []);
      } catch (error) {
        console.error(error);
      }
    };
  
    if (auth.currentUser.uid) {
      fetchAndSetUserData();
    }
  }, [auth.currentUser.uid]);
  

  const addDog = () => {
    setIsModalVisible(true);
  };

  const saveDog = async () => {
    const newDog = {
      name: dogName,
      age: dogAge,
    };
    await writeToDB(newDog, ["users", auth.currentUser.uid, "dogs"]);
    setDogAge("");
    setDogName("");
    fetchDogsData();
    setIsModalVisible(false);
  };

  const fetchDogsData = async () => {
    const dogsData = await getDocsFromDB(["users", auth.currentUser.uid, "dogs"]);
    setDogs(dogsData || []);
  };

  useEffect(() => {
    if (auth.currentUser.uid) {
      fetchDogsData();
    }
  }, [auth.currentUser.uid]);

  return (
    <View style={styles.container}>
      <Header userId={userId} />
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
            </View>
          ))}
      </View>
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="Dog Name"
            value={dogName}
            onChangeText={setDogName}
          />
          <TextInput
            style={styles.input}
            placeholder="Dog Age"
            value={dogAge}
            onChangeText={setDogAge}
            keyboardType="numeric"
          />
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
