"use client";

import { DropdownMultiselect } from "@/components/inventory/DropdownMultiselect";
import { SearchBox } from "@/components/inventory/SearchBox";
import { EditAccountModal } from "@/components/user-management/EditAccountModal";
import { UserTable } from "@/components/user-management/UserTable";
import { UserData, UserRole } from "@/types/user";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useAllActiveAccounts } from "@/lib/queries/users";
import { Spinner } from "@/components/ui/spinner";
import { useExport } from "@/contexts/UserExportContext";

function escapeCSVField(value: string | null | undefined): string {
    const str = String(value ?? "");
    if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

function getUserKey(user: UserData) {
    return user.email;
}

export default function AllAccountsPage() {
    const roleOptions: UserRole[] = ["Admin", "Case Manager", "Volunteer"];

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(roleOptions);
    const [selectedAccount, setSelectedAccount] = useState<UserData | null>(null);
    const [selectedUserKeys, setSelectedUserKeys] = useState<string[]>([]);

    const { allAccounts, editAccount, refetch, isLoading } = useAllActiveAccounts();
    const { setOnExport, setSelectedCount } = useExport();

    const filteredUsers = useMemo(() => {
        return allAccounts
            .filter((u) => selectedRoles.includes(u.role))
            .filter((u) =>
                (u.firstName + u.lastName + u.email)
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

    const handleExport = useCallback((users: UserData[]) => {
        const headers = ["First Name", "Last Name", "Role", "Email", "Date of Birth"];

        const rows = users.map((u) =>
            [
                u.firstName,
                u.lastName,
                u.role,
                u.email,
                u.dob ? u.dob.toDate().toLocaleDateString() : "",
            ].map(escapeCSVField)
        );

        const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = selectedUserKeys.length > 0 ? "selected_users.csv" : "users.csv";
        a.click();
        URL.revokeObjectURL(url);
    }, [selectedUserKeys]);

    function toggleUser(user: UserData) {
        const key = getUserKey(user);
        setSelectedUserKeys((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        );
    }

    function toggleAll() {
        const keys = filteredUsers.map(getUserKey);
        const allSelected = keys.every((k) => selectedUserKeys.includes(k));
        setSelectedUserKeys(allSelected ? [] : keys);
    }

    useEffect(() => {
        const selectedUsers = filteredUsers.filter((u) =>
            selectedUserKeys.includes(getUserKey(u))
        );

        setSelectedCount(selectedUsers.length);

        setOnExport(() => () =>
            handleExport(selectedUsers.length > 0 ? selectedUsers : filteredUsers)
        );

        return () => {
            setOnExport(null);
            setSelectedCount(0);
        };
    }, [filteredUsers, selectedUserKeys, handleExport, setOnExport, setSelectedCount]);

    return (
        <>
            {selectedAccount && (
                <EditAccountModal
                    account={selectedAccount}
                    onClose={() => setSelectedAccount(null)}
                    editAccount={editAccount}
                />
            )}

            <div className="flex gap-3 mb-4">
                <SearchBox value={searchQuery} onChange={setSearchQuery} onSubmit={refetch} />
                <DropdownMultiselect
                    label="User Type"
                    options={roleOptions}
                    selected={selectedRoles}
                    setSelected={setSelectedRoles}
                />
                {isLoading && <Spinner className="size-5 text-primary" />}
            </div>

            <div className="flex-1 overflow-auto">
                <UserTable
                    users={filteredUsers}
                    onSelect={setSelectedAccount}
                    selectedUserKeys={selectedUserKeys}
                    onToggleUser={toggleUser}
                    onToggleAll={toggleAll}
                />
            </div>
        </>
    );
}