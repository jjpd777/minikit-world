
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getStorage as getAdminStorage } from 'firebase-admin/storage';
import { initializeApp as initializeClientApp } from 'firebase/app';
import { getStorage as getClientStorage } from 'firebase/storage';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

// Initialize Firebase Admin
const adminApp = getApps().length === 0 
  ? initializeApp({
      credential: cert(serviceAccount),
      storageBucket: "bendiga-4d926.firebasestorage.app"
    })
  : getApps()[0];

// Initialize Firebase Client
const clientApp = initializeClientApp({
  storageBucket: "bendiga-4d926.firebasestorage.app"
});

// Export both admin and client storage instances
export const adminStorage = getAdminStorage(adminApp);
export const storage = getClientStorage(clientApp);
export const bucket = adminStorage.bucket();
