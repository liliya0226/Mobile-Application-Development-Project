import React, { createContext, useContext, useState, useEffect } from 'react';
import { onSnapshot, collection } from "firebase/firestore";
import { auth, database } from '../firebase-files/firebaseSetup';
import * as Location from 'expo-location';
const DogContext = createContext();

export const useDogContext = () => useContext(DogContext);

export const DogProvider = ({ children }) => {
  const [dogs, setDogs] = useState([]);
  const [selectedDog, setSelectedDog] = useState(null);
  const [userLocation, setUserLocation] = useState(null); 

  useEffect(() => {
    let unsubscribe = () => {};
  
    if (auth.currentUser) {
      const dogsRef = collection(database, "users", auth.currentUser.uid, "dogs");
      unsubscribe = onSnapshot(dogsRef, (snapshot) => {
        const dogsData = snapshot.docs.map(doc => ({
          label: doc.data().name,
          value: doc.id
        }));
        setDogs(dogsData);
      }, (error) => {
        console.error( error);
      });
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission to access location was denied');
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
      })();
    }
  
    return () => unsubscribe(); 
  }, [auth.currentUser]);
  

  return (
    <DogContext.Provider value={{ dogs, setDogs, selectedDog, setSelectedDog, userLocation }}>
      {children}
    </DogContext.Provider>
  );
};
