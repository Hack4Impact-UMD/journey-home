"use client";

import { DropdownMultiselect } from "@/components/inventory/DropdownMultiselect";
import { SearchBox } from "@/components/inventory/SearchBox";
import { EditAccountModal } from "@/components/user-management/EditAccountModal";
import { UserTable } from "@/components/user-management/UserTable";
import { UserData, UserRole } from "@/types/user";
import { useState, useEffect } from "react";
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

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(roleOptions);

    const {
        allAccounts,
        editAccount,
        refetch: refetchAllAccounts,
        isLoading,
    } = useAllActiveAccounts();

    const [selectedAccount, setSelectedAccount] = useState<UserData | null>(null);

    const { setOnExport } = useExport();

    function handleExport(users: UserData[]) {
        const headers = ["First Name", "Last Name", "Role", "Email", "Date of Birth"];
        const rows = users.map(user => [
            user.firstName,
            user.lastName,
            user.role,
            user.email,
            user.dob ? user.dob.toDate().toLocaleDateString() : ""
        ].map(escapeCSVField));

        const csv = [headers, ...rows].map(row => row.join(",")).join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "users.csv";
        a.click();
        URL.revokeObjectURL(url);
    }

    useEffect(() => {
        setOnExport(() => () => handleExport(allAccounts));
    }, [allAccounts, setOnExport]);

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
            <UserTable
                users={allAccounts
                    .filter((user) => selectedRoles.includes(user.role))
                    .filter((user) =>
                        ("" + user.firstName + user.lastName + user.email)
                            .trim()
                            .toLowerCase()
                            .replace(/\s/g, "")
                            .includes(searchQuery.toLowerCase().trim()),
                    )
                    .sort((a, b) =>
                        (a.lastName + a.firstName)
                            .toLowerCase()
                            .localeCompare(
                                (b.lastName + b.firstName).toLowerCase(),
                            ),
                    )}
                onSelect={(user: UserData) => {
                    setSelectedAccount(user);
                }}
            />
        </>
    );
}