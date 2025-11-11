"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { UserData, UserRole, AuthContextType } from "../types/user";
import { createUserInDB, fetchAllUsers } from "../lib/services/users";
import { Timestamp } from "firebase/firestore";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Signup new user
   * Role is always pending until approved by admin
   */
  const signup = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    dob: string,
    role: UserRole
  ) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const dobTimestamp = dob ? Timestamp.fromDate(new Date(dob)) : null;

    const userRecord: UserData = {
      uid: user.uid,
      firstName,
      lastName,
      email: user.email!,
      dob: dobTimestamp,
      role: "Pending",       // pending until admin approval
      emailVerified: user.emailVerified,
    };

    // Add to Firestore
    await createUserInDB(userRecord);

    return user;
  };

  /**
   * Login existing user
   */
  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  /**
   * Logout
   */
  const logout = async () => {
    await signOut(auth);
  };

  /**
   * Listen for auth changes
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch user data from Firestore
        const allUsers = await fetchAllUsers();
        const foundUser = allUsers.find((u) => u.uid === user.uid) || null;
        setUserData(foundUser);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userData, loading, signup, login, logout }}>
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
