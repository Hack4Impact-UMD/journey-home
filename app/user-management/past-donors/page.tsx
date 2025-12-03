"use client";

import { SearchBox } from "@/components/inventory/SearchBox";
import { DonorsTable } from "@/components/user-management/DonorsTable";
import { fetchAllDonors } from "@/lib/services/donations";
import { DonorInfo } from "@/types/donations";
import { useEffect, useState } from "react";

export default function PastDonorsPage() {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [allDonors, setAllDonors] = useState<DonorInfo[]>([]);

    useEffect(() => {
        fetchAllDonors().then(setAllDonors);
    }, []);

    return (
        <>
            <div className="flex flex-col mb-6">
                <div className="flex gap-3">
                    <SearchBox
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onSubmit={() => fetchAllDonors().then(setAllDonors)}
                    />
                </div>
            </div>
            <DonorsTable
                donors={allDonors.filter((donor) =>
                    (
                        "" +
                        donor.firstName +
                        donor.lastName +
                        donor.email +
                        donor.phoneNumber
                    )
                        .trim()
                        .toLowerCase()
                        .replace(/\s/g, "")
                        .includes(searchQuery.toLowerCase().trim())
                ).sort((a, b) => (a.lastName+a.firstName).toLowerCase().localeCompare((b.lastName+b.firstName).toLowerCase()))}
            />
        </>
    );
}
