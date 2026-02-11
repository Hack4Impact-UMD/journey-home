"use client";

import { DropdownMultiselect } from "@/components/inventory/DropdownMultiselect";
import { SearchBox } from "@/components/inventory/SearchBox";
import { Spinner } from "@/components/ui/spinner";
import { AccountReqTable } from "@/components/user-management/AccountReqTable";
import { useAllAccountRequests } from "@/lib/queries/users";
import { UserData, UserRole } from "@/types/user";
import { useState } from "react";

export default function AccountRequestsPage() {
    const requestOpts: UserRole[] = ["Admin", "Case Manager"];

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(requestOpts);

    const { allAccounts: allRequests, refetch: refetchAllRequests, isLoading, editAccount } = useAllAccountRequests();

    function onAccept(user: UserData) {
        if (
            !window.confirm(
                `Are you sure you want to give ${user.firstName} ${user.lastName} (${user.email}) the role ${user.pending}?`
            )
        ) {
            return;
        }
        editAccount({...user, role: user.pending ?? "Volunteer",pending: null});
    }

    return (
        <>
            <div className="flex flex-col mb-6">
                <div className="flex gap-3">
                    <SearchBox
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onSubmit={refetchAllRequests}
                    />
                    <DropdownMultiselect
                        label="Requesting"
                        options={requestOpts}
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
                ).sort((a, b) => (a.lastName+a.firstName).toLowerCase().localeCompare((b.lastName+b.firstName).toLowerCase()))}
                onAccept={onAccept}
            />
        </>
    );
}
