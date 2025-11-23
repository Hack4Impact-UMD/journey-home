"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { UserData, UserRole, AuthContextType } from "../types/user";
import { createUserInDB, fetchAllUsers } from "../lib/services/users";
import { Timestamp } from "firebase/firestore";
import { login, logout, signUp } from "@/lib/services/auth";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);


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
    <AuthContext.Provider value={{ currentUser, userData, loading, signup: signUp, login: login, logout: logout }}>
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
