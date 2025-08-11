import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, serverTimestamp, addDoc, doc, deleteDoc, updateDoc, setDoc, deleteField, writeBatch } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ai-classroom-assistant-87aab.firebaseapp.com",
  projectId: "ai-classroom-assistant-87aab",
  storageBucket: "ai-classroom-assistant-87aab.appspot.com",
  messagingSenderId: "161164248537",
  appId: "1:161164248537:web:11b7d9d912828e31e845c8",
  measurementId: "G-5N6EGGP8X9"
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, serverTimestamp, addDoc, doc, deleteDoc, updateDoc, setDoc, deleteField, writeBatch };
