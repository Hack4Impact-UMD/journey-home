import { UserRole, UserStatus } from "@/types/user";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    User,
} from "firebase/auth";
import { auth } from "../firebase";
import { Timestamp } from "firebase/firestore";
import { createUserInDB } from "./users";
import { UserData } from "@/types/user";

export async function signUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    dob: string,
    role: UserRole
): Promise<{ user: User; status: UserStatus }> {
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );
    const user = userCredential.user;

    // Map role consistently
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
        dob: dob ? Timestamp.fromDate(new Date(dob)) : null,
        role: mappedRole,
        status: status,  // Add status here
        emailVerified: user.emailVerified,
        createdAt: new Date().toISOString(),  // Add timestamp
    };

    await createUserInDB(userRecord);

    return { user, status };
}

export async function login(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
    );
    const user = userCredential.user;

    return user;
}

export async function logout(): Promise<void> {
    await signOut(auth);
}