"use client";

import { DropdownMultiselect } from "@/components/inventory/DropdownMultiselect";
import { SearchBox } from "@/components/inventory/SearchBox";
import { AccountReqTable } from "@/components/user-management/AccountReqTable";
import { approveAccount, fetchAllAccountRequests } from "@/lib/services/users";
import { UserData, UserRole } from "@/types/user";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";

export default function AccountRequestsPage() {
    const requestOpts: UserRole[] = ["Admin", "Case Manager"];

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(requestOpts);
    const [allRequests, setAllRequests] = useState<UserData[]>([]);

    useEffect(() => {
        fetchAllAccountRequests().then(setAllRequests);
    }, []);

    function onAccept(user: UserData) {
        if (
            !window.confirm(
                `Are you sure you want to give ${user.firstName} ${user.lastName} (${user.email}) the role ${user.pending}?`
            )
        ) {
            return;
        }
        approveAccount(user.uid, user.pending ?? "Volunteer");
        setAllRequests((old) => old.filter((u) => u.uid != user.uid));
    }

    return (
        <>
            <div className="flex flex-col mb-6">
                <div className="flex gap-3">
                    <SearchBox
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onSubmit={() =>
                            fetchAllAccountRequests().then(setAllRequests)
                        }
                    />
                    <DropdownMultiselect
                        label="Requesting"
                        options={requestOpts}
                        selected={selectedRoles}
                        setSelected={setSelectedRoles}
                    />
                </div>
            </div>
            <AccountReqTable
                requests={allRequests.filter(
                    (user) =>
                        user.pending != null &&
                        selectedRoles.includes(user.pending)
                ).filter((user) =>
                    ("" + user.firstName + user.lastName + user.email)
                        .trim()
                        .toLowerCase()
                        .replace(/\s/g, "")
                        .includes(searchQuery.toLowerCase().trim())
                )}
                onAccept={onAccept}
            />
        </>
    );
}
