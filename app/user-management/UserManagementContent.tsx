"use client";

import { useEffect, useState, useRef } from "react";
import { fetchAllUsers, fetchUsersByStatus, updateUserRole, approveAccount, rejectAccount, deleteUser, editUserInfo } from "../../lib/services/users";
import { UserData, UserRole } from "../../types/user";
import { SearchBox } from "@/components/inventory/SearchBox";
import { UserTable } from "@/components/user-management/UserTable";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { ExportIconOutline } from "@/components/icons/ExportIconOutline";

type TabStatus = "all" | "previous" | "requests";

export default function UserManagementContent() {
  const pathname = usePathname();
  const [users, setUsers] = useState<(UserData & { status?: string })[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<(UserData & { status?: string })[]>([]);
  
  // Determine active tab from pathname
  const getActiveTab = (): TabStatus => {
    if (pathname?.startsWith("/user-management/previous-donors")) return "previous";
    if (pathname?.startsWith("/user-management/account-requests")) return "requests";
    return "all"; // default to "all" for /user-management or /user-management/all-accounts
  };
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [userTypeFilter, setUserTypeFilter] = useState<string>("All");
  const [showUserTypeDropdown, setShowUserTypeDropdown] = useState(false);
  const userTypeDropdownRef = useRef<HTMLDivElement>(null);
  const { userData } = useAuth();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        let allUsers: (UserData & { status?: string })[];
        let currentTab: TabStatus = "all";
        if (pathname?.startsWith("/user-management/previous-donors")) {
          currentTab = "previous";
        } else if (pathname?.startsWith("/user-management/account-requests")) {
          currentTab = "requests";
        }
        
        if (currentTab === "all") {
          allUsers = await fetchAllUsers();
        } else if (currentTab === "previous") {
          allUsers = await fetchUsersByStatus("previous");
        } else {
          // requests tab - show pending users
          allUsers = await fetchUsersByStatus("pending");
        }
        setUsers(allUsers);
        setFilteredUsers(allUsers);
      } catch (error) {
        console.error("Error loading users:", error);
      }
    };
    loadUsers();
  }, [pathname]);

  useEffect(() => {
    // Close user type dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (userTypeDropdownRef.current && !userTypeDropdownRef.current.contains(event.target as Node)) {
        setShowUserTypeDropdown(false);
      }
    };

    if (showUserTypeDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserTypeDropdown]);

  useEffect(() => {
    // Filter users by search query and user type
    let filtered = users;
    
    // Apply user type filter
    if (userTypeFilter !== "All") {
      filtered = filtered.filter(user => {
        const role = user.role as string;
        if (userTypeFilter === "Admin") return role === "Admin" || role === "Administrator";
        if (userTypeFilter === "Case Manager") return role === "Case Manager" || role === "Recipient";
        if (userTypeFilter === "Volunteer") return role === "Volunteer";
        return true;
      });
    }
    
    // Apply search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.role as string).toLowerCase().includes(query)
      );
    }
    
    setFilteredUsers(filtered);
  }, [searchQuery, users, userTypeFilter]);

  const handleRoleChange = async (uid: string, newRole: UserRole) => {
    if (!userData || userData.role !== "Admin") {
      console.error("Unauthorized: only admins can update roles");
      return;
    }

    try {
      await updateUserRole(userData.role, uid, newRole);
      // Reload users based on current tab
      const currentTab = getActiveTab();
      let allUsers: (UserData & { status?: string })[];
      if (currentTab === "all") {
        allUsers = await fetchAllUsers();
      } else if (currentTab === "previous") {
        allUsers = await fetchUsersByStatus("previous");
      } else {
        allUsers = await fetchUsersByStatus("pending");
      }
      setUsers(allUsers);
      setFilteredUsers(allUsers);
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleApprove = async (uid: string, role: UserRole) => {
    if (!userData || userData.role !== "Admin") {
      console.error("Unauthorized: only admins can approve accounts");
      return;
    }

    try {
      await approveAccount(userData.role, uid, role);
      // Reload users based on current tab
      const currentTab = getActiveTab();
      let allUsers: (UserData & { status?: string })[];
      if (currentTab === "all") {
        allUsers = await fetchAllUsers();
      } else if (currentTab === "previous") {
        allUsers = await fetchUsersByStatus("previous");
      } else {
        allUsers = await fetchUsersByStatus("pending");
      }
      setUsers(allUsers);
      setFilteredUsers(allUsers);
    } catch (error) {
      console.error("Error approving account:", error);
    }
  };

  const handleReject = async (uid: string) => {
    if (!userData || userData.role !== "Admin") {
      console.error("Unauthorized: only admins can reject accounts");
      return;
    }

    try {
      await rejectAccount(userData.role, uid);
      // Reload users based on current tab
      const currentTab = getActiveTab();
      let allUsers: (UserData & { status?: string })[];
      if (currentTab === "all") {
        allUsers = await fetchAllUsers();
      } else if (currentTab === "previous") {
        allUsers = await fetchUsersByStatus("previous");
      } else {
        allUsers = await fetchUsersByStatus("pending");
      }
      setUsers(allUsers);
      setFilteredUsers(allUsers);
    } catch (error) {
      console.error("Error rejecting account:", error);
    }
  };

  const handleDelete = async (uid: string) => {
    if (!userData || userData.role !== "Admin") {
      console.error("Unauthorized: only admins can delete users");
      return;
    }

    try {
      await deleteUser(userData.role, uid);
      // Reload users based on current tab
      const currentTab = getActiveTab();
      let allUsers: (UserData & { status?: string })[];
      if (currentTab === "all") {
        allUsers = await fetchAllUsers();
      } else if (currentTab === "previous") {
        allUsers = await fetchUsersByStatus("previous");
      } else {
        allUsers = await fetchUsersByStatus("pending");
      }
      setUsers(allUsers);
      setFilteredUsers(allUsers);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = async (uid: string, updates: Partial<{
    firstName: string;
    lastName: string;
    role: UserRole;
    dob: Date | string;
  }>) => {
    if (!userData) {
      console.error("Unauthorized: user not logged in");
      return;
    }

    try {
      await editUserInfo(userData.role, uid, updates);
      // Reload users based on current tab
      const currentTab = getActiveTab();
      let allUsers: (UserData & { status?: string })[];
      if (currentTab === "all") {
        allUsers = await fetchAllUsers();
      } else if (currentTab === "previous") {
        allUsers = await fetchUsersByStatus("previous");
      } else {
        allUsers = await fetchUsersByStatus("pending");
      }
      setUsers(allUsers);
      setFilteredUsers(allUsers);
    } catch (error) {
      console.error("Error editing user:", error);
    }
  };

  const handleExportAll = () => {
    //MUST IMPLEMENT: export functionality
    console.log("Export all users");
  };

  const userTypeOptions = ["All", "Admin", "Case Manager", "Volunteer"];

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-[12px] mb-[16px] items-center">
        <SearchBox 
          value={searchQuery} 
          onChange={setSearchQuery} 
          onSubmit={() => {}}
        />
        <div className="relative" ref={userTypeDropdownRef}>
          <button
            onClick={() => setShowUserTypeDropdown(!showUserTypeDropdown)}
            className="h-[32px] border border-[#181D1F]/15 rounded-[2px] flex items-center justify-center px-[16px] py-[5px] text-[14px] font-family-roboto text-[#000000]/85 bg-white gap-[8px]"
          >
            <span className="leading-[22px]">User Type</span>
            <svg width="10" height="11.25" viewBox="0 0 10 11.25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 8.75L0 3.75H10L5 8.75Z" fill="#000000" fillOpacity="0.85"/>
            </svg>
          </button>
          {showUserTypeDropdown && (
            <div className="absolute top-full left-0 mt-[4px] bg-white border border-[#181D1F]/15 rounded-[2px] shadow-lg z-10 min-w-[107px]">
              {userTypeOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setUserTypeFilter(option);
                    setShowUserTypeDropdown(false);
                  }}
                  className="w-full text-left px-[12px] py-[8px] hover:bg-blue-50 text-[14px] font-family-roboto leading-[22px] text-[#000000]/85"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={handleExportAll}
          className="h-[32px] rounded-[2px] flex items-center justify-center px-[16px] py-[5px] gap-[8px] text-[14px] font-family-roboto text-white bg-primary"
        >
          <span>Export all</span>
          <ExportIconOutline />
        </button>
      </div>


      <UserTable
        users={filteredUsers}
        onRoleChange={handleRoleChange}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDelete}
        onEdit={handleEdit}
        currentUserRole={userData?.role || null}
      />
    </div>
  );
}

