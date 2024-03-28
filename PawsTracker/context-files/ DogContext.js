import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase-files/firebaseSetup';
import { getDocsFromDB } from '../firebase-files/firestoreHelper';

const DogContext = createContext();

export const useDogContext = () => useContext(DogContext);

export const DogProvider = ({ children }) => {
  const [dogs, setDogs] = useState([]);
  const [selectedDog, setSelectedDog] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const dogsData = await getDocsFromDB(["users", user.uid, "dogs"]);
          setDogs(dogsData.map((dog) => ({ label: dog.name, value: dog.id })) || []);
        } catch (error) {
          console.error(error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <DogContext.Provider value={{ dogs, setDogs, selectedDog, setSelectedDog }}>
      {children}
    </DogContext.Provider>
  );
};
