import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { getStorage, connectStorageEmulator, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firestore
let db: Firestore;
if (typeof window !== 'undefined') {
  db = getFirestore(app);
  
  // Connect to Firestore emulator in development
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
    const emulatorHost = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST || 'localhost';
    const emulatorPort = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_FIRESTORE_PORT || '8080';
    
    try {
      connectFirestoreEmulator(db, emulatorHost, parseInt(emulatorPort));
      console.log('Connected to Firestore emulator');
    } catch {
      // Emulator already connected
      console.log('Firestore emulator already connected');
    }
  }
} else {
  db = getFirestore(app);
}

// Initialize Storage
let storage: FirebaseStorage;
if (typeof window !== 'undefined') {
  storage = getStorage(app);
  
  // Connect to Storage emulator in development
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
    const emulatorHost = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST || 'localhost';
    const emulatorPort = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_STORAGE_PORT || '9199';
    
    try {
      connectStorageEmulator(storage, emulatorHost, parseInt(emulatorPort));
      console.log('Connected to Storage emulator');
    } catch {
      // Emulator already connected
      console.log('Storage emulator already connected');
    }
  }
} else {
  storage = getStorage(app);
}

export { app, db, storage };
export default app;
