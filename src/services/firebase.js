import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// TODO: Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3TqAHVxmGeDegryjDMS6scCddA36pfTY",
  authDomain: "personal-finance-3feb3.firebaseapp.com",
  projectId: "personal-finance-3feb3",
  storageBucket: "personal-finance-3feb3.firebasestorage.app",
  messagingSenderId: "52175874544",
  appId: "1:52175874544:web:24e6aa3c4e465b7934d535",
  measurementId: "G-CTFCHPH2JS"
};

// Initialize Firebase
let app;
let auth;
let db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  console.error('Please check your Firebase configuration in .env file or firebase.js');
  // Still initialize to prevent app crash, but features won't work
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

// Initialize Firebase services
export { auth, db };

export default app;

