"use client";

import { SearchBox } from "@/components/inventory/SearchBox";
import { DonorsTable } from "@/components/user-management/DonorsTable";
import { fetchAllDonors } from "@/lib/services/donations";
import { LocationContact } from "@/types/general";
import { useEffect, useMemo, useState } from "react";
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

function getDonorKey(donor: LocationContact): string {
    return donor.email;
}

export default function PastDonorsPage() {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [allDonors, setAllDonors] = useState<LocationContact[]>([]);
    const [selectedDonorKeys, setSelectedDonorKeys] = useState<string[]>([]);

    const { setOnExport, setSelectedCount } = useExport();

    useEffect(() => {
        fetchAllDonors().then(setAllDonors);
    }, []);

    const filteredDonors = useMemo(() => {
        return allDonors
            .filter((donor) =>
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
            )
            .sort((a, b) =>
                (a.lastName + a.firstName)
                    .toLowerCase()
                    .localeCompare((b.lastName + b.firstName).toLowerCase())
            );
    }, [allDonors, searchQuery]);

    function handleToggleDonor(donor: LocationContact) {
        const key = getDonorKey(donor);
        setSelectedDonorKeys((prev) =>
            prev.includes(key)
                ? prev.filter((k) => k !== key)
                : [...prev, key]
        );
    }

    function handleToggleAll() {
        const filteredKeys = filteredDonors.map(getDonorKey);
        const allSelected =
            filteredKeys.length > 0 &&
            filteredKeys.every((key) => selectedDonorKeys.includes(key));

        setSelectedDonorKeys(allSelected ? [] : filteredKeys);
    }

    function handleExport(donors: LocationContact[]) {
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

        const rows = donors.map((donor) =>
            [
                donor.firstName,
                donor.lastName,
                donor.email,
                donor.phoneNumber,
                donor.address.streetAddress,
                donor.address.city,
                donor.address.state,
                donor.address.zipCode,
            ].map(escapeCSVField)
        );

        const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download =
            selectedDonorKeys.length > 0 ? "selected_donors.csv" : "donors.csv";
        a.click();
        URL.revokeObjectURL(url);
    }

    useEffect(() => {
        const visibleKeys = new Set(filteredDonors.map(getDonorKey));
        setSelectedDonorKeys((prev) => prev.filter((key) => visibleKeys.has(key)));
    }, [filteredDonors]);

    useEffect(() => {
        const selectedDonors = filteredDonors.filter((donor) =>
            selectedDonorKeys.includes(getDonorKey(donor))
        );

        setSelectedCount(selectedDonors.length);

        setOnExport(() => () =>
            handleExport(selectedDonors.length > 0 ? selectedDonors : filteredDonors)
        );

        return () => {
            setOnExport(null);
            setSelectedCount(0);
        };
    }, [filteredDonors, selectedDonorKeys, setOnExport, setSelectedCount]);

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
                <DonorsTable
                    donors={filteredDonors}
                    selectedDonorKeys={selectedDonorKeys}
                    onToggleDonor={handleToggleDonor}
                    onToggleAll={handleToggleAll}
                />
            </div>
        </>
    );
}