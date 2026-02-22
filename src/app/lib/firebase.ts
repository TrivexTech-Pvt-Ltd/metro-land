import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  databaseURL:
    "https://metro-land-water-project-default-rtdb.asia-southeast1.firebasedatabase.app",
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

export const database = getDatabase(app);