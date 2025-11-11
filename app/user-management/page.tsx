"use client";

import { useEffect, useState } from "react";
import { fetchAllUsers, updateUserRole, approveAccount, rejectAccount } from "../../lib/services/users";
import { UserData, UserRole } from "../../types/user";

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserData[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      const allUsers = await fetchAllUsers();
      setUsers(allUsers);
    };
    loadUsers();
  }, []);

  const handleRoleChange = async (uid: string, newRole: UserRole) => {
    // Only call if current user is admin (check in your AuthContext)
    await updateUserRole(uid, newRole);
    const updatedUsers = await fetchAllUsers();
    setUsers(updatedUsers);
  };

  const handleApprove = async (uid: string, role: UserRole) => {
    await approveAccount(uid, role);
    const updatedUsers = await fetchAllUsers();
    setUsers(updatedUsers);
  };

  const handleReject = async (uid: string) => {
    await rejectAccount(uid);
    const updatedUsers = await fetchAllUsers();
    setUsers(updatedUsers);
  };

  return (
    <div>
      {/* Table rendering logic here */}
    </div>
  );
}
