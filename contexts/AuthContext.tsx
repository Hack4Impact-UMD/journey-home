"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { UserData, UserRole, AuthContextType } from "../types/user";
import { getUserByUID, updateEmailVerificationStatus } from "../lib/services/users";
import { login, logout, signUp } from "@/lib/services/auth";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const [authState, setAuthState] = useState<{
    currentUser: User | null;
    userData: UserData | null;
    loading: boolean;
  }>({
    currentUser: null,
    userData: null,
    loading: true,
  })


  /**
   * Listen for auth changes and check user status
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const foundUser = (user) ? await getUserByUID(user.uid) : null;

      // Sync email verification status if it changed
      if (user && foundUser && user.emailVerified !== foundUser.emailVerified) {
        try {
          await updateEmailVerificationStatus(user.uid, user.emailVerified);
          foundUser.emailVerified = user.emailVerified;
        } catch (err) {
          console.error("Failed to sync email verification status:", err);
        }
      }

      setAuthState({
        currentUser: user,
        userData: foundUser,
        loading: false
      })
    });

    return () => unsubscribe();
  }, []);

  async function _signup(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string,
    phoneExtension: string,
    dob: string,
    role: UserRole
  ): Promise<User> {
    setAuthState(old => ({...old, loading: true}));
    return (await signUp(email, password, firstName, lastName, phone, phoneExtension, dob, role))
  }

  async function _login(
    email: string,
    password: string
  ): Promise<User> {
    setAuthState(old => ({...old, loading: true}));
    return (await login(email, password))
  }

  async function _logout(): Promise<void> {
    setAuthState(old => ({...old, loading: true}));
    return (await logout())
  }

  async function _refreshUser(): Promise<void> {
    const user = auth.currentUser;
    if (!user) return;
    const foundUser = await getUserByUID(user.uid);
    setAuthState({
      currentUser: user,
      userData: foundUser,
      loading: false,
    });
  }

  return (
    <AuthContext.Provider value={{ state: authState, signup: _signup, login: _login, logout: _logout, refreshUser: _refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use AuthContext
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};