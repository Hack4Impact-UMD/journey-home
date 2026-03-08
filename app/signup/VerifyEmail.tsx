'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { resendVerificationEmail } from '@/lib/services/auth';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types/user';
import { auth } from '@/lib/firebase';

export default function VerifyEmail({ selectedRole }: { selectedRole: UserRole }) {
  const authContext = useAuth();
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  const handleResend = async () => {
    const currentUser = auth.currentUser || authContext.state.currentUser;
    if (!currentUser) return;
    
    setSending(true);
    setMessage('');
    
    try {
      await resendVerificationEmail(currentUser);
      setMessage('Verification email sent! Check your inbox.');
    } finally {
      setSending(false);
    }
  };

  const handleCheckVerification = async () => {
    try {
      const currentUser = auth.currentUser || authContext.state.currentUser;
      if (!currentUser) {
        console.log('No current user');
        setMessage('Session expired. Please log in again.');
        setTimeout(() => router.push('/login'), 2000);
        return;
      }
      
      console.log('Before reload - emailVerified:', currentUser.emailVerified);
      await currentUser.reload();
      console.log('After reload - emailVerified:', currentUser.emailVerified);
      
      if (currentUser.emailVerified) {
        // Volunteer goes to account created, others go to pending
        console.log('Email verified! Redirecting...', selectedRole);
        if (selectedRole === 'Volunteer') {
          router.push('/status/account-created');
        } else {
          router.push('/status/account-pending');
        }
      } else {
        console.log('Email not verified yet');
        setMessage('Email not verified yet. Please check your inbox and click the verification link.');
      }
    } catch (error: unknown) {
      console.error('Error checking verification:', error);
      const firebaseError = error as { code?: string };
      if (firebaseError.code === 'auth/user-token-expired') {
        setMessage('Session expired. Please log in again to continue.');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setMessage('Error checking verification. Please try again.');
      }
    }
  };

  return (
    <div className="w-full max-w-[28em] text-center">
      {/* Logo */}
      <div className="flex justify-center mb-16">
        <img
          src="/journey-home-logo.png"
          alt="Journey Home"
          className="hidden md:block h-[6em] w-[22em]"
        />
        <img
          src="/house-mobile-logo.png"
          alt="Journey Home"
          className="md:hidden w-full h-auto"
        />
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-bold font-family-roboto text-text-1 mb-6">
        Verify Your Email
      </h1>

      {/* Message */}
      <p className="text-center font-family-roboto text-text-1 mb-8">
        We sent a message to your email. Please click the link in the email to verify your account.
      </p>

      {message && (
        <p className="text-center font-family-roboto text-red-500 text-sm mb-6">
          {message}
        </p>
      )}

      {/* Buttons */}
      <div className="w-full flex flex-col gap-4">
        <button
          onClick={handleCheckVerification}
          className="w-full h-10 rounded-xs bg-primary text-white font-medium font-family-roboto"
        >
          Check Verification
        </button>

        <button
          onClick={handleResend}
          disabled={sending}
          className="w-full h-10 rounded-xs border border-primary text-primary font-medium font-family-roboto disabled:opacity-50"
        >
          {sending ? 'Sending...' : 'Resend Verification Email'}
        </button>

        <button
          onClick={authContext.logout}
          className="w-full h-10 rounded-xs border border-gray-300 text-text-1 font-medium font-family-roboto"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
