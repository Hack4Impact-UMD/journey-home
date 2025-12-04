"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { UserData, UserRole, AuthContextType } from "../types/user";
import { getUserByUID } from "../lib/services/users";
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
      // setCurrentUser(user);
      // if (user) {
      //   // Fetch user data from Firestore
      //   const foundUser = await getUserByUID(user.uid);
      //   setUserData(foundUser);
      // } else {
      //   setUserData(null);
      // }
      // setLoading(false);
      const foundUser = (user) ? await getUserByUID(user.uid) : null;

      setAuthState({
        currentUser: user,
        userData: foundUser,
        loading: false
      })
    });

    return () => unsubscribe();
  }, []);
//   signup: (
//     email: string,
//     password: string,
//     firstName: string,
//     lastName: string,
//     dob: string,
//     role: UserRole
// ) => Promise<User>;
// login: (email: string, password: string) => Promise<User>;
// logout: () => Promise<void>;
  async function _signup(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    dob: string,
    role: UserRole
  ): Promise<User> {
    setAuthState(old => ({...old, loading: true}));
    return (await signUp(email, password, firstName, lastName, dob, role))
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

  return (
    <AuthContext.Provider value={{ state: authState, signup: _signup, login: _login, logout: _logout }}>
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