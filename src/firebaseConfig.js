import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnkLvg-06GgqZgbYVt-YGHAzmLPpMfWPs",
  database: "https://mobapppp-d0f74.firebaseapp.com",
  authDomain: "mobapppp-d0f74.firebaseapp.com",
  projectId: "mobapppp-d0f74",
  storageBucket: "mobapppp-d0f74.firebasestorage.app",
  messagingSenderId: "895205094889",
  appId: "1:895205094889:web:f95cc108ce5467a4588778"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app); // Default memory-based persistence


export { auth, app };
export const db = getFirestore(app);