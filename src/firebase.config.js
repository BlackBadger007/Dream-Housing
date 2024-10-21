// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getFirestore} from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOxc0XYUSOHOWRkHFXce8To-jKAN5vkXI",
  authDomain: "housing-clone-app.firebaseapp.com",
  projectId: "housing-clone-app",
  storageBucket: "housing-clone-app.appspot.com",
  messagingSenderId: "366752835999",
  appId: "1:366752835999:web:a1fd3d1a812f8e1e9675aa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore()