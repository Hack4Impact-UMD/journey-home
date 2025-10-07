'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import LongButton from '../../components/longButton';
import InputBox from '../../components/inputBox';

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
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password.trim());

    router.push('/inventory');
    } catch (err: any) {
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div>
        <img src="/background.png" alt="Login Background" className="object-cover w-[476px] h-[832px]" />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="w-[452px] h-[565px] flex flex-col text-black space-y-4"
        >
          <img src="login-header.png" alt="Login Header" className="w-[388px] h-[107px]" />
          <h1 className="font-bold text-[24px] font-family-raleway mt-10">Welcome Back!</h1>

          <div className="font-family-opensans flex flex-col items-center space-y-3">
            <div>
              <p className="text-[16px] mb-1">Email</p>
              <InputBox
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <p className="text-[16px] mb-1">Password</p>
              <InputBox
                type="password"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            <div className="w-[452px] flex justify-end">
              <p className="text-[16px] mb-9 cursor-pointer hover:underline">Forgot Password?</p>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <LongButton
              name={loading ? 'Logging in...' : 'Login'}
              disabled={loading}
              type="submit"
            />

            <p className="text-[16px] text-center mt-2">
              Don&apos;t have an account?{' '}
              <span
                className="font-bold text-primary cursor-pointer"
                onClick={() => router.push('/register')}
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