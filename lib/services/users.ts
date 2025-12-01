"use client";

import { db } from "../firebase";
import { collection, doc, getDocs, setDoc, updateDoc, Timestamp, deleteDoc, query, where, orderBy} from "firebase/firestore";
import { UserData, UserRole } from "../../types/user";

const usersCol = collection(db, "users");

/**
 * Create a new user in Firestore
 * Stores the actual role from signup, status = "pending" until approved
 */
export const createUserInDB = async (user: UserData) => {
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, user);
};

/**
 * Fetch all users
 */
export const fetchAllUsers = async (): Promise<UserData[]> => {
  const snapshot = await getDocs(usersCol);
  const users: UserData[] = [];
  snapshot.forEach((doc) => {
    users.push(doc.data() as UserData);
  });
  return users;
};

export const fetchAllActiveUsers = async (): Promise<UserData[]> => {
  const all = await fetchAllUsers();
  return all.filter(user => user.pending == null);
}

export const fetchAllAccountRequests = async (): Promise<UserData[]> => {
  const all = await fetchAllUsers();
  return all.filter(user => user.pending != null);
};

export async function getUserByUID(uid: string): Promise<UserData | null> {
  const q = query(usersCol, where('uid', '==', uid));
  
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }
  
  // Return first matching document
  const doc = querySnapshot.docs[0];
  return doc.data() as UserData;
}

/**
 * Admin-only: update a user with new data
 */
export const updateUser = async (
  updated: UserData
) => {

  const userRef = doc(db, "users", updated.uid);
  try {
    await updateDoc(userRef, updated);
    return true;
  } catch (err) {
    console.error(err);
  }
  return false;
};

/**
 * Admin-only: approve pending account
 * Keeps the existing role, just changes status to "active"
 */
export const approveAccount = async (
  uid: string,
  role: UserRole
) => {
  
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    role, 
    pending: null,
  });
};

/**
 * Admin-only: delete a user from Firestore
 */
export const deleteUser = async (uid: string) => {

  const userRef = doc(db, "users", uid);
  await deleteDoc(userRef);
};