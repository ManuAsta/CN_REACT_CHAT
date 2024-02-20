// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyDw1CIz_WtIPv2YYdw81FljVxkV8LGZgMw",
  authDomain: "react-chat-project-87bc7.firebaseapp.com",
  projectId: "react-chat-project-87bc7",
  storageBucket: "react-chat-project-87bc7.appspot.com",
  messagingSenderId: "283960423364",
  appId: "1:283960423364:web:093d0c7631a144d891aa91",
  measurementId: "G-HEVXL56PEM"
};




// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);
export const storage=getStorage(app);

