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
    status: "pending", // Status is pending until admin approval
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
 * Keeps the existing role, just changes status to "active"
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