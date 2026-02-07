import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { onSchedule } from 'firebase-functions/v2/scheduler';

// Initialize Firebase Admin SDK
admin.initializeApp();

// Sample HTTP function
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase Functions!');
});

// Sample callable function
export const getUserData = functions.https.onCall(async (request) => {
  // Check if user is authenticated
  if (!request.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }

  const uid = request.auth.uid;
  
  try {
    // Get user data from Firestore
    const userDoc = await admin.firestore().collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'User data not found.'
      );
    }

    return {
      uid,
      data: userDoc.data()
    };
  } catch (error) {
    functions.logger.error('Error getting user data:', error);
    throw new functions.https.HttpsError(
      'internal',
      'An error occurred while fetching user data.'
    );
  }
});

// Sample Firestore trigger (commented out until Firestore database is created)
// export const onUserCreate = onDocumentCreated('users/{userId}', async (event) => {
//   const userData = event.data?.data();
//   const userId = event.params.userId;

//   functions.logger.info(`New user created: ${userId}`, userData);

//   // You can add additional logic here, such as:
//   // - Send welcome email
//   // - Create user profile
//   // - Initialize user settings
//   // - etc.

//   return null;
// });

// Sample scheduled function (runs every day at midnight)
export const dailyCleanup = onSchedule({
  schedule: '0 0 * * *',
  timeZone: 'UTC'
}, async () => {
  functions.logger.info('Running daily cleanup task');
  
  // Add your cleanup logic here
  // For example: delete old documents, update statistics, etc.
});
