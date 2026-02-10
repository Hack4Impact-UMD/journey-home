"use client";

import { DropdownMultiselect } from "@/components/inventory/DropdownMultiselect";
import { SearchBox } from "@/components/inventory/SearchBox";
import { SortOption } from "@/components/inventory/SortOption";
import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import { EditAccountModal } from "@/components/user-management/EditAccountModal";
import { UserTable } from "@/components/user-management/UserTable";
import { fetchAllActiveUsers, updateUser } from "@/lib/services/users";
import { SortStatus } from "@/types/inventory";
import { UserData, UserRole } from "@/types/user";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAllAccounts } from "@/lib/queries/users";
import { Spinner } from "@/components/ui/spinner";

export default function AllAccountsPage() {
    const roleOptions: UserRole[] = ["Admin", "Case Manager", "Volunteer"];

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(roleOptions);

    const {
        allAccounts,
        editAccount,
        refetch: refetchAllAccounts,
        isLoading,
    } = useAllAccounts();

    const [selectedAccount, setSelectedAccount] = useState<UserData | null>(
        null,
    );

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
