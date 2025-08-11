import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, serverTimestamp, addDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  // TODO: PASTE YOUR FIREBASE CONFIG OBJECT HERE
  // You can find this in your Firebase project settings.
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, serverTimestamp, addDoc, doc, deleteDoc, updateDoc };
