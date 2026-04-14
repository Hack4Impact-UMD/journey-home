"use client";

import { DropdownMultiselect } from "@/components/inventory/DropdownMultiselect";
import { SearchBox } from "@/components/inventory/SearchBox";
import { EditAccountModal } from "@/components/user-management/EditAccountModal";
import { UserTable } from "@/components/user-management/UserTable";
import { UserData, UserRole } from "@/types/user";
import { useState, useEffect, useMemo } from "react";
import { useAllActiveAccounts } from "@/lib/queries/users";
import { Spinner } from "@/components/ui/spinner";
import { useExport } from "@/contexts/UserExportContext";

function escapeCSVField(value: string | null | undefined): string {
    const str = String(value ?? "");
    if (
        str.includes(",") ||
        str.includes('"') ||
        str.includes("\n") ||
        str.includes("\r")
    ) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

function getUserKey(user: UserData): string {
    return user.email;
}

export default function AllAccountsPage() {
    const roleOptions: UserRole[] = ["Admin", "Case Manager", "Volunteer"];

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(roleOptions);
    const [selectedAccount, setSelectedAccount] = useState<UserData | null>(null);
    const [selectedUserKeys, setSelectedUserKeys] = useState<string[]>([]);

    const {
        allAccounts,
        editAccount,
        refetch: refetchAllAccounts,
        isLoading,
    } = useAllActiveAccounts();

    const { setOnExport, setSelectedCount } = useExport();

    const filteredUsers = useMemo(() => {
        return allAccounts
            .filter((user) => selectedRoles.includes(user.role))
            .filter((user) =>
                ("" + user.firstName + user.lastName + user.email)
                    .trim()
                    .toLowerCase()
                    .replace(/\s/g, "")
                    .includes(searchQuery.toLowerCase().trim())
            )
            .sort((a, b) =>
                (a.lastName + a.firstName)
                    .toLowerCase()
                    .localeCompare((b.lastName + b.firstName).toLowerCase())
            );
    }, [allAccounts, selectedRoles, searchQuery]);

    function handleToggleUser(user: UserData) {
        const key = getUserKey(user);
        setSelectedUserKeys((prev) =>
            prev.includes(key)
                ? prev.filter((k) => k !== key)
                : [...prev, key]
        );
    }

    function handleToggleAll() {
        const filteredKeys = filteredUsers.map(getUserKey);
        const allSelected =
            filteredKeys.length > 0 &&
            filteredKeys.every((key) => selectedUserKeys.includes(key));

        setSelectedUserKeys(allSelected ? [] : filteredKeys);
    }

    function handleExport(users: UserData[]) {
        const headers = ["First Name", "Last Name", "Role", "Email", "Date of Birth"];

        const rows = users.map((user) =>
            [
                user.firstName,
                user.lastName,
                user.role,
                user.email,
                user.dob ? user.dob.toDate().toLocaleDateString() : "",
            ].map(escapeCSVField)
        );

        const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = selectedUserKeys.length > 0 ? "selected_users.csv" : "users.csv";
        a.click();
        URL.revokeObjectURL(url);
    }

    useEffect(() => {
        const visibleKeys = new Set(filteredUsers.map(getUserKey));
        setSelectedUserKeys((prev) => prev.filter((key) => visibleKeys.has(key)));
    }, [filteredUsers]);

    useEffect(() => {
        const selectedUsers = filteredUsers.filter((user) =>
            selectedUserKeys.includes(getUserKey(user))
        );

        setSelectedCount(selectedUsers.length);

        setOnExport(() => () =>
            handleExport(selectedUsers.length > 0 ? selectedUsers : filteredUsers)
        );

        return () => {
            setOnExport(null);
            setSelectedCount(0);
        };
    }, [filteredUsers, selectedUserKeys, setOnExport, setSelectedCount]);

    return (
        <>
            {selectedAccount && (
                <EditAccountModal
                    account={selectedAccount}
                    onClose={() => setSelectedAccount(null)}
                    editAccount={editAccount}
                />
            )}

            <div className="flex justify-between items-center mb-2">
                <div className="flex gap-3">
                    <SearchBox
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onSubmit={refetchAllAccounts}
                    />
                    <DropdownMultiselect
                        label="User Type"
                        options={roleOptions}
                        selected={selectedRoles}
                        setSelected={setSelectedRoles}
                    />
                    {isLoading && (
                        <div className="flex items-center">
                            <Spinner className="size-5 text-primary" />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-auto min-h-0">
                <UserTable
                    users={filteredUsers}
                    onSelect={(user: UserData) => {
                        setSelectedAccount(user);
                    }}
                    selectedUserKeys={selectedUserKeys}
                    onToggleUser={handleToggleUser}
                    onToggleAll={handleToggleAll}
                />
            </div>
        </>
    );
}