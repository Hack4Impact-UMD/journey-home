"use client"

import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore"

export type UserRole = "Admin" | "Case Manager" | "Volunteer";

export type UserData = {
    uid: string,
    firstName: string,
    lastName: string,
    email: string,
    dob: Timestamp | null,
    role: UserRole,
    emailVerified: boolean
}

export interface AuthContextType {
    currentUser: User | null;
    userData: UserData | null;
    loading: boolean;
    signup: (
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        dob: string,
        role: UserRole
    ) => Promise<User>;
    login: (
        email: string, 
        password: string
    ) => Promise<User>;
    logout: () => Promise<void>;
  }