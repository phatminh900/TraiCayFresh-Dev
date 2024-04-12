// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4_feTaIiCbdTFxvUeIj4KG2tlqaxnEaQ",
  authDomain: "traicay-fresh-3a423.firebaseapp.com",
  projectId: "traicay-fresh-3a423",
  storageBucket: "traicay-fresh-3a423.appspot.com",
  messagingSenderId: "554237846939",
  appId: "1:554237846939:web:6ac7ba5b1224327aac2d3e"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const auth=getAuth(firebaseApp)