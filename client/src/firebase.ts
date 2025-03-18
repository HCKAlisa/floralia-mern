// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-web-a3109.firebaseapp.com",
    projectId: "mern-web-a3109",
    storageBucket: "mern-web-a3109.firebasestorage.app",
    messagingSenderId: "380857754815",
    appId: "1:380857754815:web:270c621c23438497cfd20a",
    measurementId: "G-JW2JW0GFS6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);