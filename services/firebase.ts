// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAHXOF4fFVNlzscCEQukLBeGXJ_SiWm5xQ",
    authDomain: "animax-5df50.firebaseapp.com",
    projectId: "animax-5df50",
    storageBucket: "animax-5df50.firebasestorage.app",
    messagingSenderId: "642862427978",
    appId: "1:642862427978:web:e7b35fb781d7441a6b9bb3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
