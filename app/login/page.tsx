'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LongButton from '@/components/auth/LongButton';
import InputBox from '../../components/auth/InputBox';
import { FirebaseError } from 'firebase/app';
import { login } from '@/lib/services/auth';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await auth.login(email, password);
      router.push("/");
    } catch (e: unknown) {
      console.error("Login failed:", e);
      setError((e as FirebaseError).message);
    }
    setLoading(false);
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
          className="w-[24em] h-[35em] flex flex-col text-black space-y-[1.2em]"
        >
          <div className="flex justify-center">
            <img
              src="/journey-home-logo.png"
              alt="Journey Home"
              className="h-[6em] w-[22em]"
            />
          </div>

          <h1 className="font-bold text-2xl text-center font-raleway mt-4">
            Welcome Back!
          </h1>

          <div className="flex flex-col items-center font-family-roboto">
            <div className="w-full mb-6">
              <p className="text-sm mb-2">Email</p>
              <InputBox
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                logo="/email-icon.png"
              />
            </div>

            <div className="w-full">
              <p className="text-sm mb-2">Password</p>
              <InputBox
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                logo="/lock-icon.png"
              />
            </div>

            <div className="w-full flex justify-end mt-2 mb-8">
              <p className="mb-4 cursor-pointer hover:underline text-sm">
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