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

export default function AllAccountsPage() {
    const roleOptions: UserRole[] = ["Admin", "Case Manager", "Volunteer"];

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(roleOptions);
    const [selectedAccount, setSelectedAccount] = useState<UserData | null>(null);

    const { allAccounts, editAccount, refetch, isLoading } = useAllActiveAccounts();
    const { setOnExport } = useExport();

    const filteredUsers = useMemo(() => {
        return allAccounts
            .filter((u) => selectedRoles.includes(u.role))
            .filter((u) =>
                (u.firstName + u.lastName + u.email)
                    .toLowerCase()
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
        a.download = "users.csv";
        a.click();
        URL.revokeObjectURL(url);
    }, []);
    useEffect(() => {


        setOnExport(() => () =>
            handleExport(filteredUsers)
        );

        return () => {
            setOnExport(null);
        };
    }, [filteredUsers, handleExport, setOnExport]);

    return (
        <>
            {selectedAccount && (
                <EditAccountModal
                    account={selectedAccount}
                    onClose={() => setSelectedAccount(null)}
                    editAccount={editAccount}
                />
            )}

            <div className="flex gap-3 mb-6">
                <SearchBox value={searchQuery} onChange={setSearchQuery} onSubmit={refetch} />
                <DropdownMultiselect
                    label="User Type"
                    options={roleOptions}
                    selected={selectedRoles}
                    setSelected={setSelectedRoles}
                />
                {isLoading && <Spinner className="size-5 text-primary" />}
            </div>

            <div className="flex-1 overflow-auto min-h-0">
                <UserTable
                    users={filteredUsers}
                    onSelect={setSelectedAccount}
                />
            </div>
        </>
    );
}