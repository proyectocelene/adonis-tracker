import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCnnVOMmrh2caF0OiMkNVpwOOScyO_Z3tY",
  authDomain: "coachv2-app.firebaseapp.com",
  projectId: "coachv2-app",
  storageBucket: "coachv2-app.firebasestorage.app",
  messagingSenderId: "967180421561",
  appId: "1:967180421561:web:cca1b034ef90788b7e0e68"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
// Nueva sintaxis moderna para habilitar caché y persistencia en múltiples pestañas (HMR seguro)
let db;
try {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
  });
} catch (error) {
  db = getFirestore(app);
}
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logoutUser = () => signOut(auth);

export { auth, db, storage };
