import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { database } from "./firebaseSetup";

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

export async function deleteFromDB(pathSegments) {
  try {
    let ref = doc(database, ...pathSegments);
    await deleteDoc(ref);
  } catch (err) {
    console.log(err);
  }
}

export async function fetchUserIdByEmail(email) {
  const usersRef = collection(database, "users");
  const q = query(usersRef, where("email", "==", email));
  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      // Assuming email is unique and there's only one match
      const userDoc = querySnapshot.docs[0];
      return userDoc.id; // Return the user ID
    } else {
      console.log("No user found with that email");
      return null; // No user found
    }
  } catch (err) {
    console.error("Error fetching user by email: ", err);
    return null; // Error occurred
  }
}
