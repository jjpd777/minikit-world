
import { initializeApp, getApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { getDatabase } from "firebase-admin/database";

let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
} catch (error) {
  console.error('Error parsing Firebase service account:', error);
  throw new Error('Invalid Firebase service account configuration');
}

let app;
try {
  app = initializeApp({
    credential: cert(serviceAccount),
    storageBucket: "gs://bendiga-4d926.firebasestorage.app",
    databaseURL: "https://bendiga-4d926-default-rtdb.firebaseio.com"
  });
} catch (error) {
  if (error.code === 'app/duplicate-app') {
    app = getApp();
  } else {
    console.error('Firebase initialization error:', error);
    throw error;
  }
}

export const storage = getStorage(app);
export const bucket = storage.bucket();
export const database = getDatabase(app);

// Add error recovery
const getValidBucket = async () => {
  try {
    await bucket.get();
    return bucket;
  } catch (error) {
    if (error.code === 401 || error.code === 403) {
      // Reinitialize on auth errors
      const newApp = initializeApp({
        credential: cert(serviceAccount),
        storageBucket: "gs://bendiga-4d926.firebasestorage.app"
      }, 'recovery-' + Date.now());
      return getStorage(newApp).bucket();
    }
    throw error;
  }
};

export { getValidBucket };
