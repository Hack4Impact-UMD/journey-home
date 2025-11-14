"use client";

import { db } from "../firebase";
import { collection, doc, getDocs, setDoc, updateDoc, Timestamp, deleteDoc, query, where, orderBy} from "firebase/firestore";
import { UserData, UserRole } from "../../types/user";

const usersCol = collection(db, "Users");

/**
 * Create a new user in Firestore
 * Stores the actual role from signup, status = "pending" until approved
 */
export const createUserInDB = async (user: UserData) => {
  const userRef = doc(db, "Users", user.uid);
  await setDoc(userRef, {
    ...user,
    // Status is already set in the user object from signup (either "pending" or "approved")
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
 * Updated to use "approved" instead of "active"
 */
export const fetchUsersByStatus = async (
  status: "approved" | "pending" | "previous"
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
 * Fetch pending users sorted by date requested
 */
export const fetchPendingUsersByDate = async (): Promise<UserData[]> => {
  const usersCol = collection(db, "Users");

  // Query for users with status = "pending", ordered by createdAt
  const q = query(usersCol, where("status", "==", "pending"), orderBy("createdAt", "asc"));
  const snapshot = await getDocs(q);

  const pendingUsers: UserData[] = [];
  snapshot.forEach((doc) => {
    pendingUsers.push(doc.data() as UserData & { status: string; createdAt: Timestamp });
  });

  return pendingUsers;
};

/**
 * Admin-only: update a user's role
 * Sets status to "approved" when role is updated
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
    status: "approved", // Changed from "active" to "approved"
  });
};

/**
 * Admin-only: approve pending account
 * Changes status to "approved" and updates role if needed
 */
export const approveAccount = async (
  currentUserRole: UserRole,
  uid: string,
  role: UserRole
) => {
  if (currentUserRole !== "Admin") throw new Error("Unauthorized: only admins can approve accounts");

  const userRef = doc(db, "Users", uid);
  await updateDoc(userRef, {
    role, // Update role if admin wants to change it during approval
    status: "approved", // Changed from "active" to "approved"
    approvedAt: Timestamp.now(), // Track when account was approved
  });
};

/**
 * Admin-only: reject pending account
 * Sets status to "rejected"
 */
export const rejectAccount = async (currentUserRole: UserRole, uid: string) => {
  if (currentUserRole !== "Admin") throw new Error("Unauthorized: only admins can reject accounts");

  const userRef = doc(db, "Users", uid);
  await updateDoc(userRef, {
    status: "rejected", // Changed from "previous" to "rejected"
    rejectedAt: Timestamp.now(), // Track when account was rejected
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

  const dataToUpdate: Record<string, unknown> = {};

  if (updates.firstName !== undefined) dataToUpdate.firstName = updates.firstName;
  if (updates.lastName !== undefined) dataToUpdate.lastName = updates.lastName;

  if (updates.dob !== undefined) {
    if (updates.dob instanceof Timestamp) {
      dataToUpdate.dob = updates.dob;
    } else {
      const parsedDate =
        updates.dob instanceof Date ? updates.dob : new Date(updates.dob);
      dataToUpdate.dob = Timestamp.fromDate(parsedDate);
    }
  }

  if (updates.role !== undefined) {
    if (currentUserRole !== "Admin") {
      throw new Error("Unauthorized: only admins can change user roles");
    }
    dataToUpdate.role = updates.role;
  }

  await updateDoc(userRef, dataToUpdate);
};