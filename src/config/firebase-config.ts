import { initializeApp } from 'firebase/app';
import { getFirestore } from '@firebase/firestore';

const firebaseConfig = {
    apiKey           : import.meta.env.VITE_FIRE_BASE_KEY,
    authDomain       : import.meta.env.VITE_FIRE_BASE_AUTH_DOMAIN,
    databaseURL      : import.meta.env.VITE_FIRE_BASE_DATABASE_URL,
    projectId        : import.meta.env.VITE_FIRE_BASE_PROJECT_ID,
    storageBucket    : import.meta.env.VITE_FIRE_BASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIRE_BASE_MESSAGING_SENDER_ID,
    appId            : import.meta.env.VITE_FIRE_BASE_APP_ID,
    measurementId    : import.meta.env.VITE_FIRE_BASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
