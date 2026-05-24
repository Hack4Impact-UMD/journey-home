import { UserRole } from "@/types/user";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    User,
    sendEmailVerification,
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
    phone: string,
    role: UserRole
): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );
    const user = userCredential.user;
    
    const userRecord: UserData = {
        uid: user.uid,
        firstName,
        lastName,
        email: user.email!,
        phone: phone,
        createdTime: Timestamp.now(),
        disabled: false,
        signedWaiver: null,
        role: "Volunteer",
        pending: (role == "Volunteer") ? null : role,
        emailVerified: user.emailVerified,
    };

    await createUserInDB(userRecord);

    return user;
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

export async function sendVerificationEmail(user: User): Promise<void> {
    await sendEmailVerification(user);
}
