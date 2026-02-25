"use client";

import { SearchBox } from "@/components/inventory/SearchBox";
import { DonorsTable } from "@/components/user-management/DonorsTable";
import { fetchAllDonors } from "@/lib/services/donations";
import { LocationContact } from "@/types/general";
import { useEffect, useState } from "react";
import { useExport } from "@/contexts/UserExportContext";

export default function PastDonorsPage() {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [allDonors, setAllDonors] = useState<LocationContact[]>([]);

    const { setOnExport } = useExport();

    function handleExport(donors: LocationContact[]) {
        const headers = ["First Name", "Last Name", "Email", "Phone Number", "Street Address", "City", "State", "Zip Code"];
        const rows = donors.map(donor => [
            donor.firstName,
            donor.lastName,
            donor.email,
            donor.phoneNumber,
            donor.address.streetAddress,
            donor.address.city,
            donor.address.state,
            donor.address.zipCode,
        ]);

        const csv = [headers, ...rows].map(row => row.join(",")).join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "donors.csv";
        a.click();
        URL.revokeObjectURL(url);
    }

    useEffect(() => {
        fetchAllDonors().then(setAllDonors);
    }, []);


    useEffect(() => {
    setOnExport(() => () => handleExport(allDonors));
}, [allDonors, setOnExport]);

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