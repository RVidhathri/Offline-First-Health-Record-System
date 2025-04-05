import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDBljeMqEE2j68MSDENc-_xMdRUXK0H25Q",
  authDomain: "secret-cipher-453016-s5.firebaseapp.com",
  projectId: "secret-cipher-453016-s5",
  storageBucket: "secret-cipher-453016-s5.appspot.com",  // Fixed typo in URL
  messagingSenderId: "126064992563",
  appId: "1:126064992563:web:0331dfb67a5f82e6381e46"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// 🔌 Enable Firestore offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.error("Persistence failed: Multiple tabs open.");
  } else if (err.code === 'unimplemented') {
    console.error("Persistence is not available in this browser.");
  }
});
