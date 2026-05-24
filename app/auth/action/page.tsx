'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  applyActionCode,
  confirmPasswordReset,
  verifyPasswordResetCode,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '@/lib/firebase';
import { getUserByUID, updateEmailVerificationStatus } from '@/lib/services/users';
import { useAuth } from '@/contexts/AuthContext';
import InputBox from '@/components/auth/InputBox';
import LongButton from '@/components/auth/LongButton';

function Shell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex h-full max-w-[30em] overflow-hidden justify-center items-center">
        <img src="/background.png" alt="Background" className="object-cover min-h-full" />
      </div>
      <div className="flex-1 flex items-center justify-center" style={{ paddingLeft: '2em', paddingRight: '2em' }}>
        <div className="w-full max-w-[24em] flex flex-col text-black gap-[1.2em]">
          <div className="flex justify-center cursor-pointer" onClick={() => router.push('/login')}>
            <img src="/journey-home-logo.png" alt="Journey Home" className="hidden md:block h-[6em] w-[22em]" />
            <img src="/house-mobile-logo.png" alt="Journey Home" className="md:hidden w-full h-auto" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

function VerifyEmailView({ oobCode }: { oobCode: string }) {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState<'loading' | 'error'>('loading');

  useEffect(() => {
    applyActionCode(auth, oobCode)
      .then(async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
          await currentUser.reload();
          await updateEmailVerificationStatus(currentUser.uid, true);
          await refreshUser();
          const userData = await getUserByUID(currentUser.uid);
          router.replace(userData?.pending ? '/status/account-pending' : '/status/account-created');
        } else {
          router.replace('/login');
        }
      })
      .catch(() => setStatus('error'));
  }, [oobCode, router, refreshUser]);

  return (
    <Shell>
      <h1 className="font-bold text-2xl text-center font-raleway">Verify Email</h1>
      {status === 'loading' && (
        <p className="text-center text-sm text-text-1 font-family-roboto">Verifying your email...</p>
      )}
      {status === 'error' && (
        <div className="flex flex-col gap-6 font-family-roboto">
          <p className="text-center text-sm text-red-500">
            This verification link is invalid or has expired. Please request a new one.
          </p>
          <LongButton name="Go to Login" onClick={() => router.push('/login')} />
        </div>
      )}
    </Shell>
  );
}

function ResetPasswordView({ oobCode }: { oobCode: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'form' | 'invalid' | 'success' | 'error'>('verifying');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    verifyPasswordResetCode(auth, oobCode)
      .then((e) => { setEmail(e); setStatus('form'); })
      .catch(() => setStatus('invalid'));
  }, [oobCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setStatus('success');
    } catch (err: unknown) {
      if (err instanceof FirebaseError && err.code === 'auth/expired-action-code') {
        setStatus('invalid');
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell>
      <h1 className="font-bold text-2xl text-center font-raleway">Reset Password</h1>

      {status === 'verifying' && (
        <p className="text-center text-sm text-text-1 font-family-roboto">Verifying your link...</p>
      )}

      {status === 'invalid' && (
        <div className="flex flex-col gap-6 font-family-roboto">
          <p className="text-center text-sm text-red-500">
            This reset link is invalid or has expired. Please request a new one.
          </p>
          <LongButton name="Forgot Password" onClick={() => router.push('/forgot-password')} />
        </div>
      )}

      {status === 'form' && (
        <form onSubmit={handleSubmit} className="flex flex-col font-family-roboto gap-[1.2em]">
          <p className="text-sm text-text-1 text-center">
            Resetting password for <span className="font-medium">{email}</span>
          </p>
          <div>
            <p className="text-sm mb-2">New Password</p>
            <InputBox
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              logo="/lock-icon.png"
            />
          </div>
          <div>
            <p className="text-sm mb-2">Confirm Password</p>
            <InputBox
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              logo="/lock-icon.png"
            />
          </div>
          {error && <p className="text-red-500 text-[0.9em] text-center">{error}</p>}
          <div className="mt-4">
            <LongButton
              name={loading ? 'Resetting...' : 'Reset Password'}
              type="submit"
            />
          </div>
        </form>
      )}

      {status === 'success' && (
        <div className="flex flex-col gap-6 font-family-roboto">
          <p className="text-center text-sm text-text-1">
            Your password has been reset. You can now log in with your new password.
          </p>
          <LongButton name="Go to Login" onClick={() => router.push('/login')} />
        </div>
      )}
    </Shell>
  );
}

function InvalidView() {
  const router = useRouter();
  return (
    <Shell>
      <h1 className="font-bold text-2xl text-center font-raleway">Invalid Link</h1>
      <div className="flex flex-col gap-6 font-family-roboto">
        <p className="text-center text-sm text-red-500">
          This link is invalid or has expired.
        </p>
        <LongButton name="Go to Login" onClick={() => router.push('/login')} />
      </div>
    </Shell>
  );
}

function AuthActionContent() {
  const params = useSearchParams();
  const mode = params.get('mode');
  const oobCode = params.get('oobCode');

  if (!oobCode) return <InvalidView />;
  if (mode === 'verifyEmail') return <VerifyEmailView oobCode={oobCode} />;
  if (mode === 'resetPassword') return <ResetPasswordView oobCode={oobCode} />;
  return <InvalidView />;
}

export default function AuthActionPage() {
  return (
    <Suspense fallback={null}>
      <AuthActionContent />
    </Suspense>
  );
}
