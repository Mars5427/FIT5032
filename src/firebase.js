import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDw1Jf0a4WIbLJiG_7bUGuDGi0SSprF2aw",
  authDomain: "week7-anjunxu.firebaseapp.com",
  projectId: "week7-anjunxu",
  storageBucket: "week7-anjunxu.firebasestorage.app",
  messagingSenderId: "501951609296",
  appId: "1:501951609296:web:bea1195eb0b7029b94a1d5"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

export { app, auth, db, GoogleAuthProvider, signInWithPopup, onAuthStateChanged }
