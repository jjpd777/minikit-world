
import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

let app;
let storage;
let bucket;

try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

  // Initialize Firebase Admin if it hasn't been initialized
  if (!app) {
    app = initializeApp({
      credential: cert(serviceAccount),
      storageBucket: "bendiga-4d926.firebasestorage.app"
    });
  }

  // Get Storage instance
  storage = getStorage(app);
  bucket = storage.bucket();
} catch (error) {
  console.error('Firebase initialization error:', error);
}

export { storage, bucket };
