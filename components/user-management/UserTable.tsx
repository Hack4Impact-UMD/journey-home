"use client";

import { UserData } from "@/types/user";
import { Badge } from "../inventory/Badge";

type UserTableProps = {
    users: UserData[];
    onSelect: (user: UserData) => void;
};

export function UserTable({ users, onSelect }: UserTableProps) {
    return (
        <div className="w-full min-w-3xl h-full flex flex-col">
            <div className="h-12 bg-[#FAFAFB] border-light-border border flex items-center font-family-roboto font-bold text-sm text-text-1 shrink-0">
                <span className="w-[25%] border-l-2 border-light-border px-4">
                    Name
                </span>
                <span className="w-[20%] border-l-2 border-light-border px-4">
                    User Type
                </span>
                <span className="w-[35%] border-l-2 border-light-border px-4">
                    Email
                </span>
                <span className="w-[20%] border-l-2 border-light-border px-4">
                    Phone Number
                </span>
            </div>
            <div className="flex-1 overflow-auto min-h-0">
                {users.map((user) => (
                    <UserTableRow user={user} key={user.uid} onSelect={() => onSelect(user)} />
                ))}
            </div>
        </div>
    );
}

function UserTableRow({ user, onSelect }: { user: UserData, onSelect: () => void }) {
    return (
        <div
            className="h-10 border-light-border border-b border-x flex items-center font-family-roboto text-sm text-text-1 hover:bg-blue-50 cursor-pointer"
            onClick={onSelect}
        >
            <div className="w-[25%] px-4 flex items-center">
                <span>
                    {user.firstName} {user.lastName}
                </span>
            </div>
            <div className="w-[20%] px-4 text-xs">
                <Badge
                    text={user.role}
                    color={user.role === "Admin" ? "light-pink" : user.role === "Case Manager" ? "indigo" : "light-green"}
                />
            </div>
            <div className="w-[35%] px-4 flex items-center">
                <span>
                    {user.email}
                </span>
            </div>
            <div className="w-[20%] px-4 flex items-center">
                <span>
                    {user.phone ?? "—"}
                </span>
            </div>
        </div>
    );
}
