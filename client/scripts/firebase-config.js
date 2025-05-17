import { getAuth } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js'
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';
import { getStorage } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-storage.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyA3v07OkI5t5O0s-x6zY_S8NvhUCzxCQiQ",
  authDomain: "filmnetwork-f4bd1.firebaseapp.com",
  projectId: "filmnetwork-f4bd1",
  storageBucket: "filmnetwork-f4bd1.firebasestorage.app",
  messagingSenderId: "1004793869759",
  appId: "1:1004793869759:web:110d03204e05533b251d0a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);
// Initialize Cloud Storage and get a reference to the service
export const docRef = doc(db, "users", "userId"); // Replace with your document ID
