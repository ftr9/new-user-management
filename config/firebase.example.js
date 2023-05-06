// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'your generated firebase config',
  authDomain: 'your generated firebase config',
  projectId: 'your generated firebase config',
  storageBucket: 'your generated firebase config',
  messagingSenderId: 'your generated firebase config',
  appId: 'your generated firebase config',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
