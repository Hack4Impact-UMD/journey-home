"use client";

import { db } from "../firebase";
import { collection, doc, getDocs, setDoc, updateDoc, Timestamp, deleteDoc} from "firebase/firestore";
import { UserData, UserRole } from "../../types/user";

const usersCol = collection(db, "Users");

/**
 * Create a new user in Firestore
 * Default role = "Pending", status = "pending"
 */
export const createUserInDB = async (user: UserData) => {
  const userRef = doc(db, "Users", user.uid);
  await setDoc(userRef, {
    ...user,
    role: "Pending",
    status: "pending",
    createdAt: Timestamp.now(),
  });
};

/**
 * Fetch all users
 */
export const fetchAllUsers = async (): Promise<UserData[]> => {
  const snapshot = await getDocs(usersCol);
  const users: UserData[] = [];
  snapshot.forEach((doc) => {
    users.push(doc.data() as UserData & { status: string });
  });
  return users;
};

/**
 * Fetch users filtered by status for tab population
 */
export const fetchUsersByStatus = async (
  status: "active" | "pending" | "previous"
): Promise<UserData[]> => {
  const snapshot = await getDocs(usersCol);
  const users: UserData[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data() as UserData & { status: string };
    if (data.status === status) users.push(data);
  });
  return users;
};

/**
 * Admin-only: update a user's role
 */
export const updateUserRole = async (
  currentUserRole: UserRole,
  uid: string,
  newRole: UserRole
) => {
  if (currentUserRole !== "Admin") throw new Error("Unauthorized: only admins can update roles");

  const userRef = doc(db, "Users", uid);
  await updateDoc(userRef, {
    role: newRole,
    status: "active", // activating user when role is updated
  });
};

/**
 * Admin-only: approve pending account
 */
export const approveAccount = async (
  currentUserRole: UserRole,
  uid: string,
  role: UserRole
) => {
  if (currentUserRole !== "Admin") throw new Error("Unauthorized: only admins can approve accounts");

  const userRef = doc(db, "Users", uid);
  await updateDoc(userRef, {
    role,
    status: "active",
  });
};

/**
 * Admin-only: reject pending account
 */
export const rejectAccount = async (currentUserRole: UserRole, uid: string) => {
  if (currentUserRole !== "Admin") throw new Error("Unauthorized: only admins can reject accounts");

  const userRef = doc(db, "Users", uid);
  await updateDoc(userRef, {
    status: "previous",
  });
};

/**
 * Admin-only: delete a user from Firestore
 */
export const deleteUser = async (currentUserRole: UserRole, uid: string) => {
  if (currentUserRole !== "Admin") {
    throw new Error("Unauthorized: only admins can delete users");
  }

  const userRef = doc(db, "Users", uid);
  await deleteDoc(userRef);
};

/**
 * Edit a user's information.
 * Only admins can change the role; other fields can be updated by the user themselves or an admin.
 */
export const editUserInfo = async (
  currentUserRole: UserRole,
  uid: string,
  updates: Partial<{
    firstName: string;
    lastName: string;
    role: UserRole;
    dob: Date | string | Timestamp;
  }>
) => {
  const userRef = doc(db, "Users", uid);

  const dataToUpdate: any = {};

  if (updates.firstName !== undefined) dataToUpdate.firstName = updates.firstName;
  if (updates.lastName !== undefined) dataToUpdate.lastName = updates.lastName;
  if (updates.dob !== undefined) {
    dataToUpdate.dob =
      updates.dob instanceof Timestamp
        ? updates.dob
        : new Timestamp(new Date(updates.dob).getTime() / 1000, 0);
  }

  if (updates.role !== undefined) {
    if (currentUserRole !== "Admin") {
      throw new Error("Unauthorized: only admins can change user roles");
    }
    dataToUpdate.role = updates.role;
  }

  await updateDoc(userRef, dataToUpdate);
};