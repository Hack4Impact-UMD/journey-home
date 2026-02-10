"use client";

import { DropdownMultiselect } from "@/components/inventory/DropdownMultiselect";
import { SearchBox } from "@/components/inventory/SearchBox";
import { EditAccountModal } from "@/components/user-management/EditAccountModal";
import { UserTable } from "@/components/user-management/UserTable";
import { fetchAllActiveUsers, updateUser } from "@/lib/services/users";
import { UserData, UserRole } from "@/types/user";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AllAccountsPage() {
    const roleOptions: UserRole[] = ["Admin", "Case Manager", "Volunteer"];

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(roleOptions);
    const [allAccounts, setAllAccounts] = useState<UserData[]>([]);

    const [selectedAccount, setSelectedAccount] = useState<UserData | null>(
        null
    );

    function editAccount(updated: UserData) {
        toast.promise(
            updateUser(updated).then((success) => {
                if (success) {
                    setSelectedAccount(null);
                    setAllAccounts((prevAccounts) =>
                        prevAccounts.map((user) =>
                            user.uid === updated.uid ? updated : user
                        )
                    );
                } else {
                    throw new Error("Couldn't update user");
                }
            }),
            {
                loading: "Updating user...",
                success: "User updated successfully!",
                error: "Error: Couldn't update user",
            }
        );
    }

    useEffect(() => {
        fetchAllActiveUsers().then(setAllAccounts);
    }, []);

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
                        onSubmit={() =>
                            fetchAllActiveUsers().then(setAllAccounts)
                        }
                    />
                    <DropdownMultiselect
                        label="User Type"
                        options={roleOptions}
                        selected={selectedRoles}
                        setSelected={setSelectedRoles}
                    />
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
                            .includes(searchQuery.toLowerCase().trim())
                    )
                    .sort((a, b) =>
                        (a.lastName + a.firstName)
                            .toLowerCase()
                            .localeCompare(
                                (b.lastName + b.firstName).toLowerCase()
                            )
                    )}
                onSelect={(user: UserData) => {
                    setSelectedAccount(user);
                }}
            />
        </>
    );
}
