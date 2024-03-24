import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, Modal, TextInput } from "react-native";
import { writeToDB, getDocsFromDB } from "../firebase-files/firestoreHelper"; // 替换为您的文件路径

export default function Profile({ route }) {
  const [userInfo, setUserInfo] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
  });
  const { userId } = route.params;
  const [dogs, setDogs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dogName, setDogName] = useState("");
  const [dogAge, setDogAge] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getDocsFromDB(["users"], userId);
   
        if (userData.length > 0) {
          // If user data was found, set it to state
          setUserInfo({
            id: userData[0].id,
            firstName: userData[0].firstName || "",
            lastName: userData[0].lastName || "",
            email: userData[0].email || "",
          });

          const dogsData = await getDocsFromDB(["users", userId, "dogs"]);
          setDogs(dogsData || []);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, [userId]);

  const addDog = () => {
    setIsModalVisible(true);
  };

  const saveDog = async () => {
    const newDog = {
      name: dogName,
      age: dogAge,
    };
    await writeToDB(newDog, ["users", userInfo.id, "dogs"]);
    setDogAge("");
    setDogName("");
    fetchDogsData();
    setIsModalVisible(false);
  };

  const fetchDogsData = async () => {
    const dogsData = await getDocsFromDB(["users", userInfo.id, "dogs"]);
    setDogs(dogsData || []);
  };

  useEffect(() => {
    if (userInfo.id) {
      fetchDogsData();
    }
  }, [userInfo.id]);

  return (
    <View style={styles.container}>
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
