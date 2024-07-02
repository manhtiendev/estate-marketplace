// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'estate-app-5ca99.firebaseapp.com',
  projectId: 'estate-app-5ca99',
  storageBucket: 'estate-app-5ca99.appspot.com',
  messagingSenderId: '263250829330',
  appId: '1:263250829330:web:4415aaf76225b71a06b8cb',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
