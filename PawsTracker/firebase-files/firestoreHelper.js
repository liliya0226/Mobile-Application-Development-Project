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

export async function writeUserToDB(userId, data, pathSegments) {
  try {
    const userDocRef = doc(database, ...pathSegments, userId);
    await setDoc(userDocRef, data);
    console.log("User data has been written to the database successfully.");
    return userDocRef;
  } catch (err) {
    console.error("Error writing data to the database:", err);
    throw err;
  }
}

export async function writeToDB(data, pathSegments) {
  try {
    let ref = collection(database, ...pathSegments);
    const docRef = await addDoc(ref, data);
    return docRef;
  } catch (err) {
    console.log(err);
  }
}

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

export async function updateInDB(data, pathSegments) {
  try {
    const docRef = doc(database, ...pathSegments);
    await setDoc(docRef, data, { merge: true });

  } catch (err) {
    console.error("Error updating document:", err);
    throw err;
  }
}

export async function deleteFromDB(pathSegments) {
  try {
    let ref = doc(database, ...pathSegments);
    await deleteDoc(ref);
  } catch (err) {
    console.log(err);
  }
}

export async function addImageUrlToUserDocument(userId, imageUrl) {
  try {
    const userRef = doc(database, "users", userId);
    await updateDoc(userRef, { profileImage: imageUrl });
  } catch (error) {
    console.error("Error adding image URL to user document:", error);
  }
}

export async function addLocationToUserDocument(userId, location) {
  try {
    const userRef = doc(database, "users", userId);
    await updateDoc(userRef, { location: location });
  } catch (error) {
    console.error("Error adding location info to user document:", error);
  }
}
