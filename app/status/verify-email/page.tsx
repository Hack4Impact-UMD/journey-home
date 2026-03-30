'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { resendVerificationEmail } from '@/lib/services/auth';
import { updateEmailVerificationStatus } from '@/lib/services/users';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import AuthMobileNavbar from '@/components/auth/AuthMobileNavbar';
import { Spinner } from '@/components/ui/spinner';

export default function VerifyEmailPage() {
  const authContext = useAuth();
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!authContext.state.loading && !authContext.state.currentUser) {
      router.push('/login');
    }
  }, [authContext.state, router]);

  if (authContext.state.loading || !authContext.state.userData) {
    return (
      <div className="w-full h-full flex justify-center items-center pb-24">
        <Spinner className="size-12 text-primary" />
      </div>
    );
  }

  const effectiveRole = authContext.state.userData.pending ?? authContext.state.userData.role;

  const handleLogout = async () => {
    await authContext.logout();
    router.push('/login');
  };

  const handleResend = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    setSending(true);
    setMessage('');

    try {
      await resendVerificationEmail(currentUser);
      setIsError(false);
      setMessage('Verification email sent! Check your inbox.');
    } catch (error) {
      console.error('Error sending verification email:', error);
      setIsError(true);
      setMessage('Failed to send verification email. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleCheckVerification = async () => {
    if (checking) return;

    setChecking(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setIsError(true);
        setMessage('Session expired. Please log in again.');
        setTimeout(() => router.push('/login'), 2000);
        return;
      }

      await currentUser.reload();

      if (currentUser.emailVerified) {
        await updateEmailVerificationStatus(currentUser.uid, true);
        await authContext.refreshUser();

        if (effectiveRole === 'Volunteer') {
          router.push('/status/account-created');
        } else {
          router.push('/status/account-pending');
        }
      } else {
        setIsError(true);
        setMessage('Email not verified yet. Please check your inbox and click the verification link.');
      }
    } catch (error: unknown) {
      console.error('Error checking verification:', error);
      const firebaseError = error as { code?: string };
      setIsError(true);
      if (firebaseError.code === 'auth/user-token-expired') {
        setMessage('Session expired. Please log in again to continue.');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setMessage('Error checking verification. Please try again.');
      }
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="bg-background flex flex-col h-screen overflow-hidden">
      <AuthMobileNavbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left side - background image, desktop only */}
        <div className="hidden md:flex shrink-0 items-start justify-start h-full">
          <img
            src="/background.png"
            alt="Background"
            className="h-[58em] w-[30em] object-cover object-left overflow-hidden"
          />
        </div>

        {/* Right side - content */}
        <div className="flex flex-1 flex-col h-full items-center justify-center" style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
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

            <h1 className="text-2xl font-bold font-family-roboto text-text-1 mb-6">
              Verify Your Email
            </h1>

            <p className="text-center font-family-roboto text-text-1 mb-8">
              We sent a message to your email. Please click the link in the email to verify your account.
            </p>

            {message && (
              <p className={`text-center font-family-roboto text-sm mb-6 ${isError ? 'text-red-500' : 'text-green-600'}`}>
                {message}
              </p>
            )}

            <div className="w-full flex flex-col gap-4">
              <button
                onClick={handleCheckVerification}
                disabled={checking}
                className="w-full h-10 rounded-xs bg-primary text-white font-medium font-family-roboto disabled:opacity-50"
              >
                {checking ? 'Checking...' : 'Check Verification'}
              </button>

              <button
                onClick={handleResend}
                disabled={sending}
                className="w-full h-10 rounded-xs border border-primary text-primary font-medium font-family-roboto disabled:opacity-50"
              >
                {sending ? 'Sending...' : 'Resend Verification Email'}
              </button>

              <button
                onClick={handleLogout}
                className="w-full h-10 rounded-xs border border-gray-300 text-text-1 font-medium font-family-roboto"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
