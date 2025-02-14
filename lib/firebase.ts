
import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "bendiga-4d926.appspot.com"
});

// Get Storage instance
export const storage = getStorage(app);
export const bucket = storage.bucket();
