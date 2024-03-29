// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
} from "@env";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
};

// Initialize Firebase
const myApp = initializeApp(firebaseConfig);
export const database = getFirestore(myApp);
