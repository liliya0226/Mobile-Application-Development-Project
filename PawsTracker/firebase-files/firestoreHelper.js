import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { database } from "./firebaseSetup";

export async function writeToDB(data, pathSegments) {
  try {
    let ref = collection(database, ...pathSegments);
    await addDoc(ref, data);
  } catch (err) {
    console.log(err);
  }
}

export async function getDocsFromDB(pathSegments) {
  try {
    let ref = collection(database, ...pathSegments);
    const querySnapshot = await getDocs(ref);
    let docsArray = [];
    querySnapshot.forEach((doc) => {
      let docData = doc.data();
      docData.id = doc.id; // Optionally add doc ID to data
      docsArray.push(docData);
    });
    return docsArray;
  } catch (err) {
    console.log(err);
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
