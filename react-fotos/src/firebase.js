// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDIEgM_l8SnBeRxm_KBk1dAVuoLkceBW48",
  authDomain: "login-46d73.firebaseapp.com",
  projectId: "login-46d73",
  storageBucket: "login-46d73.firebasestorage.app",
  messagingSenderId: "121986153815",
  appId: "1:121986153815:web:c13f07b024ae568915d212"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
