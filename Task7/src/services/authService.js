import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";

const ERROR_MESSAGES = {
  "auth/email-already-in-use": "This email is already registered.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
  "auth/popup-closed-by-user": "Sign-in window was closed.",
  "auth/popup-blocked": "Your browser blocked the sign-in window.",
  "auth/network-request-failed": "Network error. Check your connection.",
};

function toMessage(error) {
  return ERROR_MESSAGES[error.code] || "Something went wrong. Please try again.";
}

const persistenceReady = setPersistence(auth, browserLocalPersistence);

export async function signUp(email, password) {
  try {
    await persistenceReady;
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    return credential.user;
  } catch (error) {
    throw new Error(toMessage(error));
  }
}

export async function logIn(email, password) {
  try {
    await persistenceReady;
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  } catch (error) {
    throw new Error(toMessage(error));
  }
}

export async function logInWithGoogle() {
  try {
    await persistenceReady;
    const credential = await signInWithPopup(auth, googleProvider);
    return credential.user;
  } catch (error) {
    throw new Error(toMessage(error));
  }
}

export async function logOut() {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(toMessage(error));
  }
}

export function subscribeToAuthChanges(callback) {
  return onAuthStateChanged(auth, callback);
}