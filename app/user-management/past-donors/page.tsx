"use client";

import { SearchBox } from "@/components/inventory/SearchBox";
import { DonorsTable } from "@/components/user-management/DonorsTable";
import { fetchAllDonors } from "@/lib/services/donations";
import { LocationContact } from "@/types/general";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useExport } from "@/contexts/UserExportContext";

function escapeCSVField(value: string | null | undefined): string {
    const str = String(value ?? "");
    if (
        str.includes(",") ||
        str.includes('"') ||
        str.includes("\n") ||
        str.includes("\r")
    ) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

export default function PastDonorsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [allDonors, setAllDonors] = useState<LocationContact[]>([]);

    const { setOnExport } = useExport();

    useEffect(() => {
        fetchAllDonors().then(setAllDonors);
    }, []);

    const filtered = useMemo(() => {
        return allDonors
            .filter((d) =>
                (d.firstName + d.lastName + d.email)
                    .toLowerCase()
                    .replace(/\s/g, "")
                    .includes(searchQuery.toLowerCase().trim())
            )
            .sort((a, b) =>
                (a.lastName + a.firstName)
                    .toLowerCase()
                    .localeCompare((b.lastName + b.firstName).toLowerCase())
            );
    }, [allDonors, searchQuery]);

    const handleExport = useCallback((donors: LocationContact[]) => {
        const headers = [
            "First Name",
            "Last Name",
            "Email",
            "Phone Number",
            "Street Address",
            "City",
            "State",
            "Zip Code",
        ];

        const rows = donors.map((d) =>
            [
                d.firstName,
                d.lastName,
                d.email,
                d.phoneNumber,
                d.address.streetAddress,
                d.address.city,
                d.address.state,
                d.address.zipCode,
            ].map(escapeCSVField)
        );

        const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "donors.csv";
        a.click();
        URL.revokeObjectURL(url);
    }, []);

    useEffect(() => {
        setOnExport(() => () => handleExport(filtered));

        return () => {
            setOnExport(null);
        };
    }, [filtered, handleExport, setOnExport]);

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

            <div className="flex-1 overflow-auto min-h-0">
                <DonorsTable donors={filtered} />
            </div>
        </>
    );
}
