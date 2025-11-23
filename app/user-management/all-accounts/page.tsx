"use client";

import { DropdownMultiselect } from "@/components/inventory/DropdownMultiselect";
import { SearchBox } from "@/components/inventory/SearchBox";
import { SortOption } from "@/components/inventory/SortOption";
import { UserTable } from "@/components/user-management/UserTable";
import { fetchAllActiveUsers } from "@/lib/services/users";
import { SortStatus } from "@/types/inventory";
import { UserData, UserRole } from "@/types/user";
import { User } from "lucide-react";
import { useEffect, useState } from "react";

export default function AllAccountsPage() {
    const roleOptions: UserRole[] = ["Admin", "Case Manager", "Volunteer"];

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(roleOptions);
    const [allAccounts, setAllAccounts] = useState<UserData[]>([]);

    useEffect(() => {
        fetchAllActiveUsers().then(setAllAccounts);
    }, []);

    return (
        <>
            <div className="flex flex-col mb-6">
                <div className="flex gap-3">
                    <SearchBox
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onSubmit={() => fetchAllActiveUsers().then(setAllAccounts)}
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
                    )}
            />
        </>
    );
}
