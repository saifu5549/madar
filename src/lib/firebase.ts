import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDyl4-U9ppuHMUOO1gtyKXfeYxKcVsYAZY",
    authDomain: "madarsha-7c40d.firebaseapp.com",
    projectId: "madarsha-7c40d",
    storageBucket: "madarsha-7c40d.firebasestorage.app",
    messagingSenderId: "572144864830",
    appId: "1:572144864830:web:c8e43530f5a713c9ba8b6f",
    measurementId: "G-V3VL2CTFFX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;
