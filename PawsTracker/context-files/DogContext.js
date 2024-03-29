import React, { createContext, useContext, useState, useEffect } from 'react';
import { onSnapshot, collection } from "firebase/firestore";
import { auth, database } from '../firebase-files/firebaseSetup';

const DogContext = createContext();

export const useDogContext = () => useContext(DogContext);

export const DogProvider = ({ children }) => {
  const [dogs, setDogs] = useState([]);
  const [selectedDog, setSelectedDog] = useState(null);

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
    }
  
    return () => unsubscribe(); 
  }, [auth.currentUser]);
  

  return (
    <DogContext.Provider value={{ dogs, setDogs, selectedDog, setSelectedDog }}>
      {children}
    </DogContext.Provider>
  );
};
