"use client";

import { SearchBox } from "@/components/inventory/SearchBox";
import { SortOption } from "@/components/inventory/SortOption";
import { SortStatus } from "@/types/inventory";
import { useState } from "react";

export default function AllAccountsPage() {

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [dateSort, setDateSort] = useState<SortStatus>("desc");

    return <>
        <div className="flex flex-col mb-6">
            <div className="flex gap-3">
                <SearchBox 
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onSubmit={() => {}}
                />
                <SortOption
                    label="Request Date"
                    status={dateSort}
                    onChange={setDateSort}
                />
            </div>
        </div>
    </>;
}