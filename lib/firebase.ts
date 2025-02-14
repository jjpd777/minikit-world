import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

const app = initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "bendiga-4d926.firebasestorage.app"
});

export const storage = getStorage(app);
export const bucket = storage.bucket();