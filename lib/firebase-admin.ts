
import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "bendiga-4d926.firebasestorage.rapp"
});

// Get Storage instance
export const storage = getStorage(app);
export const bucket = storage.bucket();
