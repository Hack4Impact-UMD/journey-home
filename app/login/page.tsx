'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import LongButton from '../../components/longButton';
import InputBox from '../../components/inputBox';
import { FirebaseError } from 'firebase/app';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      router.push('/inventory');
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'auth/invalid-email':
            setError('Invalid email format.');
            break;
          case 'auth/user-not-found':
            setError('No user found with this email.');
            break;
          case 'auth/wrong-password':
            setError('Incorrect password.');
            break;
          default:
            setError('Failed to log in. Please try again.');
        }
      } else {
        setError('Failed to log in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div>
        <img
          src="/background.png"
          alt="Login Background"
          className="object-cover w-[30em] h-[52em]"
        />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="w-[28em] h-[35em] flex flex-col text-black space-y-[1.2em]"
        >
          <div className="flex justify-center">
            <img
              src="journey-home-logo.png"
              alt="Journey Home"
              className="h-[6em] w-[22em]"
            />
          </div>

          <h1 className="font-bold text-[1.5em] text-center font-raleway mt-[1em]">
            Welcome Back!
          </h1>

          <div className="font-opensans flex flex-col items-center space-y-[1em]">
            <div className="w-full">
              <p className="text-[1em] mb-[0.3em]">Email</p>
              <InputBox
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                logo="/email-icon.png"
              />
            </div>

            <div className="w-full">
              <p className="text-[1em] mb-[0.3em]">Password</p>
              <InputBox
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                logo="/lock-icon.png"
              />
            </div>

            <div className="w-full flex justify-end">
              <p className="text-[1em] mb-[1em] cursor-pointer hover:underline">
                Forgot Password?
              </p>
            </div>

            {error && (
              <p className="text-red-500 text-[0.9em] text-center">{error}</p>
            )}

            <LongButton
              name={loading ? 'Logging in...' : 'Login'}
              disabled={loading}
              type="submit"
            />

            <p className="text-[1em] text-center mt-[0.8em]">
              Don&apos;t have an account?{' '}
              <span
                className="font-bold text-primary cursor-pointer"
                onClick={() => router.push('/signup')}
              >
                Register
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}