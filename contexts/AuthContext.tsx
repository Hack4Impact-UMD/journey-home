"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { UserData, UserRole, AuthContextType, UserStatus } from "../types/user";
import { createUserInDB, fetchAllUsers } from "../lib/services/users";
import { Timestamp } from "firebase/firestore";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  /**
   * Signup new user
   * Sets status to "pending" for Admin/Case Manager, "approved" for Volunteer
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

    // Map role consistently - Administrator should be stored as Admin
    const roleStr = role as string;
    const mappedRole: UserRole = 
      roleStr === "Administrator" ? "Admin" :
      role as UserRole;

    // Determine status based on role
    const status: UserStatus = 
      mappedRole === "Admin" || role === "Case Manager"
        ? "pending" 
        : "approved";

    const userRecord: UserData = {
      uid: user.uid,
      firstName,
      lastName,
      email: user.email!,
      dob: dobTimestamp,
      role: mappedRole,           // Store the actual role, not "Pending"
      status: status,              // Set status field
      emailVerified: user.emailVerified,
    };

    // Add to Firestore
    await createUserInDB(userRecord);

    // Return both user and status to match the updated return type
    return { user, status };
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
   * Listen for auth changes and check user status
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch user data from Firestore
        const allUsers = await fetchAllUsers();
        const foundUser = allUsers.find((u) => u.uid === user.uid) || null;
        setUserData(foundUser);

        // Check user status and redirect if necessary
        if (foundUser) {
          // Pages that pending users are allowed to see
          const allowedPendingPages = ['/status', '/login', '/signup'];
          const isOnAllowedPage = allowedPendingPages.some(page => pathname?.startsWith(page));

          if (foundUser.status === "pending" && !isOnAllowedPage) {
            // Pending users trying to access protected pages -> redirect to pending page
            router.push("/status?type=pending");
          } else if (foundUser.status === "rejected") {
            // Rejected users must be logged out
            await signOut(auth);
            router.push("/login?error=rejected");
          }
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

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