import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  getBytes,
} from "firebase/storage";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  doc,
  query,
  where,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBs0l1RrPTxtlAKwgx-XiZOG1Dr8qMfWu0",
  authDomain: "links-98106.firebaseapp.com",
  projectId: "links-98106",
  storageBucket: "links-98106.appspot.com",
  messagingSenderId: "741900812365",
  appId: "1:741900812365:web:7dda0baad3b8a2a7d59c04",
  measurementId: "G-Q06M706K2E",
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
