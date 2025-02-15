
import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
} catch (error) {
  console.error('Error parsing Firebase service account:', error);
  throw new Error('Invalid Firebase service account configuration');
}

const app = initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "gs://bendiga-4d926.firebasestorage.app"
});

export const storage = getStorage(app);
export const bucket = storage.bucket();

bucket.on('response', (response) => {
  console.log('Firebase Storage Response:', {
    status: response.statusCode,
    statusMessage: response.statusMessage
  });
});

bucket.on('error', (error) => {
  console.error('Firebase Storage Error:', {
    code: error.code,
    message: error.message
  });
});
