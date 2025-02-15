
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  storageBucket: "bendiga-4d926.appspot.com"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
