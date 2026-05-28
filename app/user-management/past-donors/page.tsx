"use client";

import { SearchBox } from "@/components/inventory/SearchBox";
import { DonorsTable } from "@/components/user-management/DonorsTable";
import { fetchAllDonors } from "@/lib/services/donations";
import { LocationContact } from "@/types/general";
import { useEffect, useMemo, useState } from "react";
import { useExport } from "@/contexts/ExportContext";
import { exportDonors } from "@/lib/csv-exports";

export default function PastDonorsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [allDonors, setAllDonors] = useState<LocationContact[]>([]);

    const { setExportHandler } = useExport();

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

    useEffect(() => {
        setExportHandler(() => exportDonors(filtered));
        return () => setExportHandler(null);
    }, [filtered, setExportHandler]);

    return (
        <>
            <div className="flex flex-col mb-6">
                <div className="flex flex-wrap gap-3">
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
