import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore, CACHE_SIZE_UNLIMITED } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyDBljeMqEE2j68MSDENc-_xMdRUXK0H25Q",
  authDomain: "secret-cipher-453016-s5.firebaseapp.com",
  projectId: "secret-cipher-453016-s5",
  storageBucket: "secret-cipher-453016-s5.appspot.com",
  messagingSenderId: "126064992563",
  appId: "1:126064992563:web:0331dfb67a5f82e6381e46"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  experimentalForceLongPolling: true
});
export const storage = getStorage(app);
