"use client";

import { UserData } from "@/types/user";
import { Badge } from "../inventory/Badge";
import { ViewIcon } from "../icons/ViewIcon";
import { TrashIcon } from "../icons/TrashIcon";

type UserTableProps = {
    users: UserData[];
    onSelect: (user: UserData) => void;
};

export function UserTable({ users, onSelect }: UserTableProps) {
    return (
        <div className="w-full min-w-3xl h-full flex flex-col">
            <div className="h-12 bg-[#FAFAFB] border-light-border border flex items-center font-family-roboto font-bold text-sm text-text-1 shrink-0">
                <span className="w-[20%] border-l-2 border-light-border px-4">
                    Name
                </span>
                <span className="w-[20%] border-l-2 border-light-border px-4">
                    User Type
                </span>
                <span className="w-[20%] border-l-2 border-light-border px-4">
                    Email
                </span>
                <span className="w-[20%] border-l-2 border-light-border px-4">
                    Actions
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
            <div className="w-[20%] px-4 flex items-center">
                <input
                    type="checkbox"
                    className="w-4 h-4 mr-4 rounded-xs cursor-pointer border-white"
                ></input>
                <span>
                    {user.firstName} {user.lastName}
                </span>
            </div>
            <div className="w-[20%] px-4 text-xs">
                <Badge
                    text={user.role}
                    color="gray"
                />
            </div>
            <div className="w-[20%] px-4 flex items-center">
                <span>
                    {user.email}
                </span>
            </div>
            <div className="w-[20%] px-4 flex align-center">
                <ViewIcon />
                <TrashIcon />
            </div>
        </div>
    );
}
