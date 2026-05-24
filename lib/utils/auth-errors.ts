import { FirebaseError } from 'firebase/app';

const messages: Record<string, string> = {
  // Login
  'auth/invalid-credential':      'Invalid email or password.',
  'auth/user-not-found':          'Invalid email or password.',
  'auth/wrong-password':          'Invalid email or password.',
  'auth/invalid-email':           'Please enter a valid email address.',
  'auth/user-disabled':           'This account has been disabled.',
  'auth/too-many-requests':       'Too many failed attempts. Please wait a moment or reset your password.',
  // Signup
  'auth/email-already-in-use':    'An account with this email already exists.',
  'auth/weak-password':           'Password is too weak. Please choose a stronger one.',
  // General
  'auth/network-request-failed':  'Network error. Please check your connection and try again.',
};

export function authErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError && messages[error.code]) {
    return messages[error.code];
  }
  return 'Something went wrong. Please try again.';
}
