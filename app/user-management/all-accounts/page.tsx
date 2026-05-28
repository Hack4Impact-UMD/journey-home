"use client";

import { DropdownMultiselect } from "@/components/inventory/DropdownMultiselect";
import { SearchBox } from "@/components/inventory/SearchBox";
import { EditAccountModal } from "@/components/user-management/EditAccountModal";
import { UserTable } from "@/components/user-management/UserTable";
import { UserData, UserRole } from "@/types/user";
import { useState, useEffect, useMemo } from "react";
import { useAllActiveAccounts } from "@/lib/queries/users";
import { Spinner } from "@/components/ui/spinner";
import { useExport } from "@/contexts/ExportContext";
import { exportUsers } from "@/lib/csv-exports";

export default function AllAccountsPage() {
    const roleOptions: UserRole[] = ["Admin", "Case Manager", "Volunteer"];
    const statusOptions = ["Active", "Disabled"] as const;
    type AccountStatus = typeof statusOptions[number];

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(roleOptions);
    const [selectedAccount, setSelectedAccount] = useState<UserData | null>(null);
    const [selectedStatuses, setSelectedStatuses] = useState<AccountStatus[]>([...statusOptions]);

    const { allAccounts, editAccount, refetch: refetchAllAccounts, isLoading } = useAllActiveAccounts();
    const { setExportHandler } = useExport();

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

    useEffect(() => {
        setExportHandler(() => exportUsers(filteredUsers));
        return () => setExportHandler(null);
    }, [filteredUsers, setExportHandler]);

    return (
        <>
            {selectedAccount && (
                <EditAccountModal
                    account={selectedAccount}
                    onClose={() => setSelectedAccount(null)}
                    editAccount={editAccount}
                />
            )}
            <div className="flex flex-col mb-6">
                <div className="flex flex-wrap gap-3">
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
                    <DropdownMultiselect
                        label="Status"
                        options={[...statusOptions]}
                        selected={selectedStatuses}
                        setSelected={setSelectedStatuses}
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
                users={allAccounts
                    .filter((user) => selectedRoles.includes(user.role))
                    .filter((user) => selectedStatuses.includes(user.disabled ? "Disabled" : "Active"))
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
            </div>
        </>
    );
}