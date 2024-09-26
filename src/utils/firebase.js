


// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnr5NgC5st1K8Z8qRf9tjr58a9s7iRy0Y",
  authDomain: "job-portal-661f9.firebaseapp.com",
  projectId: "job-portal-661f9",
  storageBucket: "job-portal-661f9.appspot.com",
  messagingSenderId: "794632187896",
  appId: "1:794632187896:web:30a6c06885f049e993700d",
  measurementId: "G-E42F30B8D6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize and export Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Function to sign up with email and password
export const signUpWithEmailPassword = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Function to sign in with Google
export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};
