"use client";

import { UserData } from "@/types/user";
import { Badge } from "../inventory/Badge";
import { ViewIcon } from "../icons/ViewIcon";
import { TrashIcon } from "../icons/TrashIcon";

type UserTableProps = {
    users: UserData[];
    onSelect: (user: UserData) => void;
    selectedUserKeys: string[];
    onToggleUser: (user: UserData) => void;
    onToggleAll: () => void;
};

export function UserTable({
    users,
    onSelect,
    selectedUserKeys,
    onToggleUser,
    onToggleAll,
}: UserTableProps) {
    const allSelected =
        users.length > 0 && users.every((user) => selectedUserKeys.includes(user.email));

    return (
        <div className="w-full min-w-3xl h-full flex flex-col">
            <div className="h-12 bg-[#FAFAFB] border-light-border border flex items-center font-family-roboto font-bold text-sm text-text-1 shrink-0">
                <span className="w-[20%] border-l-2 border-light-border px-4 flex items-center">
                    <input
                        type="checkbox"
                        className="w-4 h-4 mr-4 rounded-xs cursor-pointer border-white"
                        checked={allSelected}
                        onChange={onToggleAll}
                    />
                    First Name
                </span>
                <span className="w-[20%] border-l-2 border-light-border px-4">
                    Last Name
                </span>
                <span className="w-[15%] border-l-2 border-light-border px-4">
                    User Type
                </span>
                <span className="w-[23%] border-l-2 border-light-border px-4">
                    Email
                </span>
                <span className="w-[12%] border-l-2 border-light-border px-4">
                    Date of Birth
                </span>
                <span className="w-[10%] border-l-2 border-light-border px-4">
                    Actions
                </span>
            </div>

            <div className="flex-1 overflow-auto min-h-0">
                {users.map((user) => (
                    <UserTableRow
                        key={user.uid}
                        user={user}
                        onSelect={() => onSelect(user)}
                        isSelected={selectedUserKeys.includes(user.email)}
                        onToggle={() => onToggleUser(user)}
                    />
                ))}
            </div>
        </div>
    );
}

function UserTableRow({
    user,
    onSelect,
    isSelected,
    onToggle,
}: {
    user: UserData;
    onSelect: () => void;
    isSelected: boolean;
    onToggle: () => void;
}) {
    return (
        <div
            className="h-10 border-light-border border-b border-x flex items-center font-family-roboto text-sm text-text-1 hover:bg-blue-50 cursor-pointer"
            onClick={onSelect}
        >
            <div className="w-[20%] px-4 flex items-center">
                <input
                    type="checkbox"
                    className="w-4 h-4 mr-4 rounded-xs cursor-pointer border-white"
                    checked={isSelected}
                    onChange={onToggle}
                    onClick={(e) => e.stopPropagation()}
                />
                <span>{user.firstName}</span>
            </div>

            <div className="w-[20%] px-4">
                <span>{user.lastName}</span>
            </div>

            <div className="w-[15%] px-4 text-xs">
                <Badge text={user.role} color="gray" />
            </div>

            <div className="w-[23%] px-4 flex items-center">
                <span>{user.email}</span>
            </div>

            <span className="w-[12%] px-4">
                {user.dob &&
                    user.dob.toDate().toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                        timeZone: "UTC",
                    })}
            </span>

            <div
                className="w-[10%] px-4 flex items-center gap-2"
                onClick={(e) => e.stopPropagation()}
            >
                <button type="button" onClick={onSelect}>
                    <ViewIcon />
                </button>
                <button type="button">
                    <TrashIcon />
                </button>
            </div>
        </div>
    );
}