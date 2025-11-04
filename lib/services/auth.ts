import { UserRole } from "@/types/user";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    User,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";

export async function signUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    dob: string,
    role: UserRole
): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: email,
        firstName: firstName,
        lastName: lastName,
        dob: dob ? Timestamp.fromDate(new Date(dob)) : null,
        role: role,
        emailVerified: false,
    });

    return user;
    // let err = error as FirebaseError;
    // if (err.code === "auth/email-already-in-use") {
    //     return "This email is already registered.";
    // } else if (err.code === "auth/weak-password") {
    //     return "Password must be 6 characters or longer.";
    // } else if (err.code === "auth/invalid-email") {
    //     return "Invalid Email Address";
    // } else {
    //     return err.message;
    // }
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
