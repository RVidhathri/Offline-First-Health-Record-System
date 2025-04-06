import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  connectAuthEmulator, 
  setPersistence, 
  browserLocalPersistence,
  PhoneAuthProvider
} from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { toast } from "react-toastify";

export const firebaseConfig = {
  apiKey: "AIzaSyDBljeMqEE2j68MSDENc-_xMdRUXK0H25Q",
  authDomain: "secret-cipher-453016-s5.firebaseapp.com",
  projectId: "secret-cipher-453016-s5",
  storageBucket: "secret-cipher-453016-s5.appspot.com",
  messagingSenderId: "126064992563",
  appId: "1:126064992563:web:0331dfb67a5f82e6381e46"
};

// Initialize Firebase immediately
let app;
let auth;
let db;
let storage;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  // Set persistence immediately
  setPersistence(auth, browserLocalPersistence).catch(error => {
    console.error("Error setting persistence:", error);
    toast.error("Error initializing authentication. Please refresh the page.");
  });
} catch (error) {
  console.error("Error initializing Firebase:", error);
  toast.error("Error initializing application. Please refresh the page.");
}

// Test Firebase connectivity
export const testFirebaseConnection = async () => {
  try {
    if (!auth) {
      throw new Error("Firebase Auth not initialized");
    }
    // Test auth state
    await new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe();
        resolve();
      }, (error) => {
        unsubscribe();
        throw error;
      });
    });
    return true;
  } catch (error) {
    console.error("Firebase connection error:", error);
    throw error;
  }
};

export { auth, db, storage };

// Function to get phone auth provider
export const getPhoneAuthProvider = () => {
  return new PhoneAuthProvider(auth);
};

// Test connection in development
if (process.env.NODE_ENV === 'development') {
  // Uncomment these lines if you want to use Firebase emulators
  // connectAuthEmulator(auth, "http://localhost:9099");
  // connectFirestoreEmulator(db, 'localhost', 8080);
  // connectStorageEmulator(storage, "localhost", 9199);
}
