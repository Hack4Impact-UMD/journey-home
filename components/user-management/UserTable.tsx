"use client";

import { UserData } from "@/types/user";



type UserTableProps = {
  users: UserData[];
};

export function UserTable({
  users,
}: UserTableProps) {
  return (
    <div className="w-full h-full min-w-3xl">
      <div className="h-[48px] bg-[#FAFAFB] border-b border-[#181D1F]/15 flex items-center font-family-roboto font-bold text-[14px] text-[#181d1f]">
        <span className="w-[5%] border-l-[2px] border-[#181D1F]/15 pl-[16px]">
        </span>
        <span className="w-[12%] border-l-[2px] border-[#181D1F]/15 pl-[16px]">
          First Name
        </span>
        <span className="w-[12%] border-l-[2px] border-[#181D1F]/15 pl-[16px]">
          Last Name
        </span>
        <span className="w-[12%] border-l-[2px] border-[#181D1F]/15 pl-[16px]">
          User Type
        </span>
        <span className="w-[20%] border-l-[2px] border-[#181D1F]/15 pl-[16px]">
          Email
        </span>
        <span className="w-[15%] border-l-[2px] border-[#181D1F]/15 pl-[16px]">
          Date of Birth
        </span>
        <span className="w-[15%] border-l-[2px] border-[#181D1F]/15 pl-[16px]">
          Actions
        </span>
      </div>
      {users.map((user) => (
        <UserTableRow
          user={user}
          key={user.uid}
        />
      ))}
    </div>
  );
}

function UserTableRow({
  user,
}: {
  user: UserData;
}) {


  const availableRoles: string[] = ["Admin", "Case Manager", "Volunteer"];


  const handleRoleSelect = (newRole: string) => {
    const dbRole: UserRole = newRole === "Administrator" ? "Admin" : (newRole as UserRole);
    setSelectedRole(dbRole);
    setShowRoleDropdown(false);
    if (isPending && onApprove) {
      // When approving, update both role and status
      onApprove(user.uid, dbRole);
    } else if (onRoleChange) {
      // When changing role of active user
      onRoleChange(user.uid, dbRole);
    }
  };

  const formatDateOfBirth = (dob: Timestamp | Date | null) => {
    if (!dob) return "N/A";
    try {
      if (dob instanceof Date) {
        return dob.toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        });
      } else if ("toDate" in dob && typeof dob.toDate === "function") {
        // Firestore Timestamp
        return dob.toDate().toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        });
      }
      return "N/A";
    } catch {
      return "N/A";
    }
  };

  return (
    <div className={`${isPending ? 'min-h-[64px]' : 'h-[42px]'} border-x border-b border-[#181D1F]/15 flex items-center font-family-roboto text-[14px] text-[#181d1f] hover:bg-blue-50`}>
      <div className="w-[5%] pl-[16px] flex items-center gap-[8px]">
        <input
          type="checkbox"
          className="w-4 h-4 rounded-[2px] cursor-pointer border-[#d9d9d9]"
        />
      </div>
      <div className="w-[12%] pl-[16px] leading-[normal]">{user.firstName}</div>
      <div className="w-[12%] pl-[16px] leading-[normal]">{user.lastName}</div>
      <div className="w-[12%] pl-[16px] flex flex-col items-start justify-center gap-[10px]">
        {isAdmin ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="text-left"
            >
              <Badge
                text={getDisplayRole(user.role)}
                color="gray"
              />
            </button>
            {showRoleDropdown && (
              <div className="absolute top-full left-0 mt-[4px] bg-white border border-[#181D1F]/15 rounded-[2px] shadow-lg z-10 min-w-[120px]">
                {availableRoles.map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleSelect(role)}
                    className="w-full text-left px-[12px] py-[8px] hover:bg-blue-50 text-[14px] font-family-roboto leading-[22px] text-[#000000]/85"
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <Badge
            text={getDisplayRole(user.role)}
            color="gray"
          />
        )}
        {isPending && (
          <Badge
            text="Pending"
            color="orange"
          />
        )}
      </div>
      <div className="w-[20%] pl-[16px] leading-[normal]">{user.email}</div>
      <div className="w-[15%] pl-[16px] leading-[normal]">
        {formatDateOfBirth(user.dob)}
      </div>
      <div className="w-[15%] pl-[16px] flex gap-[12px] items-center">
        {isPending && isAdmin ? (
          <>
            {onApprove && (
              <button
                onClick={() => onApprove(user.uid, selectedRole)}
                className="text-[14px] bg-primary rounded-[2px] h-[32px] px-[16px] text-white font-family-roboto leading-[22px]"
              >
                Approve
              </button>
            )}
            {onReject && (
              <button
                onClick={() => onReject(user.uid)}
                className="text-[14px] rounded-[2px] h-[32px] px-[16px] border border-[#181D1F]/15 font-family-roboto leading-[22px] text-[#000000]/85 bg-white"
              >
                Reject
              </button>
            )}
          </>
        ) : (
          <>
            <button className="cursor-pointer">
              <ExportIcon />
            </button>
            {isAdmin && (
              <>
                <button 
                  className="cursor-pointer"
                  onClick={() => {
                    // For now, just log - can be extended with a modal/form later
                    if (onEdit) {
                      //MUST IMPLEMENT: Open edit modal/form with user data
                      console.log("Edit user:", user);
                    }
                  }}
                >
                  <EditIcon />
                </button>
                <button 
                  className="cursor-pointer"
                  onClick={() => {
                    if (onDelete && confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
                      onDelete(user.uid);
                    }
                  }}
                >
                  <TrashIcon />
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

