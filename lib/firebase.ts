import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDMwQXeiDibuy6q0q_emHGAmxB3xSqRVbU",
  authDomain: "values-auction-ed09c.firebaseapp.com",
  databaseURL: "https://values-auction-ed09c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "values-auction-ed09c",
  storageBucket: "values-auction-ed09c.firebasestorage.app",
  messagingSenderId: "157059499738",
  appId: "1:157059499738:web:c1c20c62219f91168b87e3"
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(FIREBASE_CONFIG) : getApps()[0];

// Export Firebase services
export const auth = getAuth(app);
export const db = getDatabase(app);
export const dbFirestore = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

/**
 * Recursively cleans an object for Firestore by removing `undefined` properties
 * or converting them, while preserving Firestore FieldValues, Timestamps, and Dates.
 */
export function sanitizeForFirestore<T>(data: T): T {
  if (data === undefined) {
    return null as any;
  }
  if (data === null || typeof data !== "object") {
    return data;
  }
  const proto = Object.getPrototypeOf(data);
  const isPlainObj = proto === null || proto === Object.prototype;

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeForFirestore(item)) as any;
  }

  if (!isPlainObj) {
    return data;
  }

  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      clean[key] = sanitizeForFirestore(value);
    }
  }
  return clean as T;
}

export default app;
