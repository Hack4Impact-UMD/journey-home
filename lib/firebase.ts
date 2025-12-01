import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app); 

const auth = getAuth(app);


if(process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
  connectFirestoreEmulator(
    db, 
    process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST ?? 'localhost', 
    parseInt(process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_FIRESTORE_PORT ?? '8080')
  );

  connectStorageEmulator(
    storage, 
    process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST ?? 'localhost', 
    parseInt(process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_STORAGE_PORT ?? '9199')
  );

  connectAuthEmulator(
  auth,
  `http://${process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST ?? 'localhost'}:${process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_AUTH_PORT ?? '9099'}`
  );

}

export { app, db, storage, auth};
export default app;