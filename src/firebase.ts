import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAbgeZga4kyqZqQ7Dpf6pVThAzi9g9MOKk",
  authDomain: "nolbir-io-4464-58b8d.firebaseapp.com",
  projectId: "nolbir-io-4464-58b8d",
  storageBucket: "nolbir-io-4464-58b8d.firebasestorage.app",
  messagingSenderId: "340747701267",
  appId: "1:340747701267:web:ebf08fa9caf14b7106c3e6",
  measurementId: "G-5KZYWFKMCP",
};

export const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
