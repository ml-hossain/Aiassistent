// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBo-n67rcquDWNeS1NkFB8WiRa-QJdhqps",
  authDomain: "ai-assistant-ml.firebaseapp.com",
  projectId: "ai-assistant-ml",
  storageBucket: "ai-assistant-ml.firebasestorage.app",
  messagingSenderId: "660663466944",
  appId: "1:660663466944:web:29ad23e1472965945ea625",
  measurementId: "G-59KJLC80QX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (optional)
export const analytics = getAnalytics(app);

export default app;
