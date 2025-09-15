# Firebase Setup Guide

This guide will help you set up Firebase with Firestore and Storage for your Journey Home project using Firebase CLI and emulators.

## Prerequisites

1. **Firebase CLI**: Install [Firebase CLI](https://firebase.google.com/docs/cli)
2. **Node.js**: Ensure you have Node.js installed

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Configuration

1. Copy the environment template:
   ```bash
   cp env.example .env.local
   ```

2. Update `.env.local` with your Firebase project values from Terraform outputs:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-from-terraform-output
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket-from-terraform-output
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id-from-terraform-output
   ```

3. Update `.firebaserc` with your project ID:
   ```json
   {
     "projects": {
       "default": "your-project-id-here"
     }
   }
   ```

### 4. Firebase Emulator Setup

1. Install Firebase CLI globally (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project (if needed):
   ```bash
   firebase init
   ```

4. Start the emulators:
   ```bash
   npm run firebase:emulator
   ```

   Or start specific emulators:
   ```bash
   npm run firebase:emulator:ui  # Firestore and Storage only
   ```

### 5. Development Workflow

1. **Start the Next.js development server**:
   ```bash
   npm run dev
   ```

2. **Start Firebase emulators** (in a separate terminal):
   ```bash
   npm run firebase:emulator
   ```

3. **Access the Firebase Emulator UI** at `http://localhost:4000`

## Project Structure

```
journey_home/
├── lib/
│   ├── firebase.ts          # Firebase initialization
│   ├── firestore.ts         # Firestore service utilities
│   └── storage.ts           # Storage service utilities
├── terraform/               # Terraform configurations
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── README.md
├── firebase.json            # Firebase configuration
├── firestore.rules          # Firestore security rules
├── firestore.indexes.json   # Firestore indexes
├── storage.rules            # Storage security rules
└── .firebaserc             # Firebase project configuration
```

## Usage

### Firestore
```typescript
import { FirestoreService } from '@/lib/firestore';

// Create a document
const docId = await FirestoreService.create('posts', {
  title: 'My Post',
  content: 'Post content',
  author: 'John Doe'
});

// Read a document
const post = await FirestoreService.read('posts', docId);

// Update a document
await FirestoreService.update('posts', docId, { title: 'Updated Title' });

// Delete a document
await FirestoreService.delete('posts', docId);
```

### Storage
```typescript
import { StorageService } from '@/lib/storage';

// Upload a file
const file = // your file object
const result = await StorageService.uploadFile(file, 'uploads/myfile.jpg');

// Get download URL
const downloadURL = await StorageService.getDownloadURL('uploads/myfile.jpg');

// Delete a file
await StorageService.deleteFile('uploads/myfile.jpg');
```

## Environment Variables

The following environment variables are available:

- `NEXT_PUBLIC_FIREBASE_API_KEY`: Firebase API key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Firebase auth domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Firebase project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Firebase storage bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Firebase messaging sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID`: Firebase app ID
- `NEXT_PUBLIC_USE_FIREBASE_EMULATOR`: Set to 'true' to use emulators

## Emulator Configuration

The emulators are configured to run on:
- **Firestore**: `localhost:8080`
- **Storage**: `localhost:9199`
- **Auth**: `localhost:9099`
- **UI**: `localhost:4000`

## Security Rules

The current rules allow full access for development. Update the security rules in:
- `firestore.rules` - for Firestore security
- `storage.rules` - for Storage security

## Deployment

To deploy to production:

1. Update security rules for production use
2. Deploy Firebase rules and indexes:
   ```bash
   npm run firebase:deploy
   ```

3. Deploy your Next.js app to your preferred hosting platform

## Troubleshooting

1. **Emulator connection issues**: Ensure the emulator is running and ports are not blocked
2. **Authentication errors**: Verify your Firebase project configuration
3. **Permission denied**: Check your security rules and authentication status
4. **Terraform errors**: Ensure you have proper Google Cloud permissions and billing enabled
