
import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "bendiga-4d926.firebasestorage.app"
});

// Get Storage instance
export const storage = getStorage(app);
export const bucket = storage.bucket();

// Add logging
bucket.on('response', (response) => {
  console.log('Firebase Storage Response:', {
    status: response.statusCode,
    statusMessage: response.statusMessage,
    headers: response.headers
  });
});

bucket.on('error', (error) => {
  console.error('Firebase Storage Error:', {
    code: error.code,
    message: error.message,
    stack: error.stack
  });
});
