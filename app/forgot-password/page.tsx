'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FirebaseError } from 'firebase/app';
import InputBox from '@/components/auth/InputBox';
import LongButton from '@/components/auth/LongButton';
import { resetPassword } from '@/lib/services/auth';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await resetPassword(email);
      setSent(true);
    } catch (e: unknown) {
      if (e instanceof FirebaseError && e.code === 'auth/user-not-found') {
        setSent(true);
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex h-full max-w-[30em] overflow-hidden justify-center items-center">
        <img
          src="/background.png"
          alt="Background"
          className="object-cover min-h-full"
        />
      </div>

      <div className="flex-1 flex items-center justify-center" style={{ paddingLeft: '2em', paddingRight: '2em' }}>
        <div className="w-full max-w-[24em] flex flex-col text-black space-y-[1.2em]">
          <div className="flex justify-center cursor-pointer" onClick={() => router.push('/login')}>
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

          <h1 className="font-bold text-2xl text-center font-raleway mt-4">
            Forgot Password
          </h1>

          {sent ? (
            <div className="flex flex-col items-center gap-6 font-family-roboto">
              <p className="text-center text-sm text-text-1">
                If an account exists for <span className="font-medium">{email}</span>, you&apos;ll receive a password reset link shortly. Check your Spam or Junk folder if you don&apos;t see it.
              </p>
              <LongButton
                name="Back to Login"
                type="button"
                onClick={() => router.push('/login')}
              />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col items-center font-family-roboto gap-[1.2em]">
              <div className="w-full">
                <p className="text-sm mb-2">Email</p>
                <InputBox
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  logo="/email-icon.png"
                />
              </div>

              {error && (
                <p className="text-red-500 text-[0.9em] text-center">{error}</p>
              )}

              <div className="w-full mt-4">
                <LongButton
                  name={loading ? 'Sending...' : 'Send Reset Email'}
                  type="submit"
                />
              </div>

              <p className="text-[1em] text-center">
                Remember your password?{' '}
                <span
                  className="font-bold text-primary cursor-pointer"
                  onClick={() => router.push('/login')}
                >
                  Login
                </span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
