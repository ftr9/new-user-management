// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA7COQ6SJhp7yEz58YThUl6RWxRWXLo0Lw',
  authDomain: 'updateusermanagement-a9554.firebaseapp.com',
  projectId: 'updateusermanagement-a9554',
  storageBucket: 'updateusermanagement-a9554.appspot.com',
  messagingSenderId: '250452695647',
  appId: '1:250452695647:web:f4d0dbf04fd5177b1e59ea',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
