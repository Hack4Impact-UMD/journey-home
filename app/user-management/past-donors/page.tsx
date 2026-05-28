"use client";

import { SearchBox } from "@/components/inventory/SearchBox";
import { DonorsTable } from "@/components/user-management/DonorsTable";
import { fetchAllDonors } from "@/lib/services/donations";
import { LocationContact } from "@/types/general";
import { useEffect, useMemo, useState } from "react";
import { exportDonors } from "@/lib/csv-exports";
import { ExportButton } from "@/components/general/ExportButton";

export default function PastDonorsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [allDonors, setAllDonors] = useState<LocationContact[]>([]);

    useEffect(() => {
        fetchAllDonors().then(setAllDonors);
    }, []);

    const filtered = useMemo(() => {
        return allDonors
            .filter((d) =>
                (d.firstName + d.lastName + d.email)
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase().trim())
            )
            .sort((a, b) =>
                (a.lastName + a.firstName)
                    .toLowerCase()
                    .localeCompare((b.lastName + b.firstName).toLowerCase())
            );
    }, [allDonors, searchQuery]);

    return (
        <>
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <SearchBox
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onSubmit={() => fetchAllDonors().then(setAllDonors)}
                />
                <ExportButton
                    label="Export Past Donors"
                    onClick={() => exportDonors(filtered)}
                    className="md:ml-auto"
                />
            </div>

            <div className="flex-1 overflow-auto min-h-0">
                <DonorsTable donors={filtered} />
            </div>
        </>
    );
}
