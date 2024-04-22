import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { database } from "./firebaseSetup";

// Function to write user data to the database
export async function writeUserToDB(userId, data, pathSegments) {
  try {
    // Construct a reference to the user document
    const userDocRef = doc(database, ...pathSegments, userId);
    
    // Set the user data in the document
    await setDoc(userDocRef, data);
    
    // Log success message
    console.log("User data has been written to the database successfully.");
    
    // Return the reference to the user document
    return userDocRef;
  } catch (err) {
    console.error("Error writing data to the database:", err);
    throw err;
  }
}

// Function to write data to the database
export async function writeToDB(data, pathSegments) {
  try {
    // Construct a reference to the collection
    let ref = collection(database, ...pathSegments);
    
    // Add a new document with the provided data to the collection
    const docRef = await addDoc(ref, data);
    
    // Return the reference to the newly added document
    return docRef;
  } catch (err) {
    console.log(err);
  }
}

// Function to get documents from the database
export async function getDocsFromDB(pathSegments, docId = null) {
  try {
    if (docId) {
      // If a docId is provided, fetch a single document
      const docRef = doc(database, ...pathSegments, docId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        let docData = docSnap.data();
        docData.id = docSnap.id; // Optionally add the doc ID to the data
        return [docData]; // Return an array containing the data of the single document
      } else {
        console.log("No such document!");
        return []; // Return an empty array if the document was not found
      }
    } else {
      // If no docId is provided, fetch all documents in the collection
      let ref = collection(database, ...pathSegments);
      const querySnapshot = await getDocs(ref);
      let docsArray = [];
      querySnapshot.forEach((doc) => {
        let docData = doc.data();
        docData.id = doc.id; // Optionally add the doc ID to the data
        docsArray.push(docData);
      });
      return docsArray; // Return the data of all documents in the collection
    }
  } catch (err) {
    console.log(err);
    return []; // Return an empty array in case of an error
  }
}

// Function to update data in the database
export async function updateInDB(data, pathSegments) {
  try {
    // Construct a reference to the document
    const docRef = doc(database, ...pathSegments);
    
    // Update the document with the provided data
    await setDoc(docRef, data, { merge: true });
  } catch (err) {
    console.error("Error updating document:", err);
    throw err;
  }
}

// Function to delete data from the database
export async function deleteFromDB(pathSegments) {
  try {
    // Construct a reference to the document
    let ref = doc(database, ...pathSegments);
    
    // Delete the document
    await deleteDoc(ref);
  } catch (err) {
    console.log(err);
  }
}

// Function to add an image URL to a user document
export async function addImageUrlToUserDocument(userId, imageUrl) {
  try {
    // Construct a reference to the user document
    const userRef = doc(database, "users", userId);
    
    // Update the user document with the image URL
    await updateDoc(userRef, { profileImage: imageUrl });
  } catch (error) {
    console.error("Error adding image URL to user document:", error);
  }
}

// Function to add location information to a user document
export async function addLocationToUserDocument(userId, location) {
  try {
    // Construct a reference to the user document
    const userRef = doc(database, "users", userId);
    
    // Update the user document with the location information
    await updateDoc(userRef, { location: location });
  } catch (error) {
    console.error("Error adding location info to user document:", error);
  }
}
