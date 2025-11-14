"use client"

import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore"

export type UserRole = "Admin" | "Donor" | "Recipient" | "Pending" | "Case Manager" | "Volunteer" | "Administrator";

export type UserStatus = "pending" | "approved" | "rejected" | "previous";

export type UserData = {
    uid: string,
    firstName: string,
    lastName: string,
    email: string,
    dob: Timestamp | null,
    role: UserRole,
    status?: UserStatus,  
    emailVerified: boolean,
    createdAt?: string,
    approvedAt?: string,
    rejectedAt?: string
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
    ) => Promise<{ user: User; status: UserStatus }>;  // Update return type
    login: (
        email: string, 
        password: string
    ) => Promise<User>;
    logout: () => Promise<void>;
}