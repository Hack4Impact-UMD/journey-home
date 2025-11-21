"use client";

import { DropdownMultiselect } from "@/components/inventory/DropdownMultiselect";
import { SearchBox } from "@/components/inventory/SearchBox";
import { SortOption } from "@/components/inventory/SortOption";
import { SortStatus } from "@/types/inventory";
import { UserRole } from "@/types/user";
import { useState } from "react";

export default function AllAccountsPage() {

     const roleOptions: UserRole[] = ["Admin", "Case Manager", "Volunteer"];

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(roleOptions)


    return <>
        <div className="flex flex-col mb-6">
            <div className="flex gap-3">
                <SearchBox 
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onSubmit={() => {}}
                />
                <DropdownMultiselect
                    label="User Type"
                    options={roleOptions}
                    selected={selectedRoles}
                    setSelected={setSelectedRoles}
                />
            </div>
            {selectedRoles}
        </div>
    </>;
}