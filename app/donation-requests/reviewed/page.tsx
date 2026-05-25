"use client";

import { DRContentsTable } from "@/components/donation-requests/DRContentsTable";
import { DRTable } from "@/components/donation-requests/DRTable";
import { ItemReviewModal } from "@/components/donation-requests/ItemReviewModal";
import { SearchBox } from "@/components/inventory/SearchBox";
import { SortOption } from "@/components/inventory/SortOption";
import { useDonationRequests } from "@/lib/queries/donation-requests";
import { DonationItem, DonationRequest, DonationSearchParams } from "@/types/donations";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useExport } from "@/contexts/ExportContext";

function escapeCSVField(value: string | null | undefined): string {
    const str = String(value ?? "");
    if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

export default function ReviewedRequestsPage() {
    const { donationRequests, setDonationRequestToast, refetch } = useDonationRequests();
    const [selectedDRId, setSelectedDRId] = useState<string | null>(null);
    const selectedDR = donationRequests.find((dr) => dr.id === selectedDRId) ?? null;
    const [selectedItem, setSelectedItem] = useState<DonationItem | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchParams, setSearchParams] = useState<DonationSearchParams>({
        status: [],
        sortBy: "Date",
        ascending: false,
    });

    const { setOnExport } = useExport();

    const filtered = useMemo(() => {
        return donationRequests
            .filter((request) => {
                const donorFullName = `${request.donor.firstName} ${request.donor.lastName}`.toLowerCase();
                const completedRequest = request.items.every(
                    (donItem) => donItem.status === "Approved" || donItem.status === "Denied",
                );
                if (!completedRequest) return false;

                if (searchParams.status.length != 0) {
                    if (!searchParams.status.includes("Finished")) return false;
                }

                return donorFullName.includes(searchQuery.toLowerCase());
            })
            .sort((req1, req2) => {
                let diff;
                if (searchParams.sortBy == "Date") {
                    diff = req1.date.seconds - req2.date.seconds;
                } else if (searchParams.sortBy == "Quantity") {
                    diff = req1.items.length - req2.items.length;
                } else {
                    diff = `${req1.donor.lastName} ${req1.donor.firstName}`.localeCompare(
                        `${req2.donor.lastName} ${req2.donor.firstName}`,
                    );
                }
                if (!searchParams.ascending) diff *= -1;
                return diff;
            });
    }, [donationRequests, searchQuery, searchParams]);

    const handleExport = useCallback((requests: DonationRequest[]) => {
        const headers = ["First Name", "Last Name", "Email", "Phone Number", "Street Address", "Apt", "City", "State", "Zip Code", "First Time Donor", "Can Drop Off", "How Did You Hear", "Responded", "Notes", "Date Submitted", "Items"];
        const rows = requests.map((r) =>
            [
                r.donor.firstName,
                r.donor.lastName,
                r.donor.email,
                r.donor.phoneNumber,
                r.donor.address.streetAddress,
                r.donor.address.apt ?? "",
                r.donor.address.city,
                r.donor.address.state,
                r.donor.address.zipCode,
                r.firstTimeDonor ? "Yes" : "No",
                r.canDropOff ? "Yes" : "No",
                r.howDidYouHear,
                r.responded ? "Yes" : "No",
                r.notes,
                r.date.toDate().toLocaleDateString(),
                r.items.map((di) => `${di.item.category}(${di.item.quantity})-${di.status}`).join(";"),
            ].map(escapeCSVField)
        );
        const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "reviewed-donation-requests.csv";
        a.click();
        URL.revokeObjectURL(url);
    }, []);

    useEffect(() => {
        if (selectedDRId) {
            setOnExport(null);
            return;
        }
        setOnExport(() => () => handleExport(filtered));
        return () => setOnExport(null);
    }, [filtered, handleExport, setOnExport, selectedDRId]);

    return selectedDR ? (
        <>
            {selectedItem && (
                <ItemReviewModal
                    dr={selectedDR}
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                    setStatus={(status) => {
                        setDonationRequestToast({
                            ...selectedDR,
                            items: selectedDR.items.map((item) =>
                                item.item.id === selectedItem.item.id
                                    ? { ...item, status }
                                    : item,
                            ),
                        }).then(() => setSelectedItem(null));
                    }}
                />
            )}
            <div className="flex flex-col">
                <div className="flex flex-wrap gap-3">
                    <button
                        className="w-16 h-8 text-white bg-primary rounded-xs text-sm"
                        onClick={() => setSelectedDRId(null)}
                    >
                        Back
                    </button>
                    <SearchBox value={""} onChange={() => {}} onSubmit={() => {}} />
                    <SortOption label="Date" onChange={() => {}} status="none" />
                    <SortOption label="Qnt" onChange={() => {}} status="none" />
                </div>
                <span className="font-bold py-4.5">
                    {selectedDR.donor.firstName} {selectedDR.donor.lastName}
                </span>
            </div>
            <div className="flex-1 overflow-auto min-h-0">
                <DRContentsTable request={selectedDR} openItem={setSelectedItem} />
            </div>
        </>
    ) : (
        <>
            <div className="flex flex-col mb-6">
                <div className="flex flex-wrap gap-3">
                    <SearchBox
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onSubmit={() => refetch()}
                    />
                    <SortOption
                        label="Date"
                        status={searchParams.sortBy != "Date" ? "none" : searchParams.ascending ? "asc" : "desc"}
                        onChange={(status) => setSearchParams((prev) => ({ ...prev, sortBy: "Date", ascending: status == "asc" }))}
                    />
                    <SortOption
                        label="Qnt"
                        status={searchParams.sortBy != "Quantity" ? "none" : searchParams.ascending ? "asc" : "desc"}
                        onChange={(status) => setSearchParams((prev) => ({ ...prev, sortBy: "Quantity", ascending: status == "asc" }))}
                    />
                </div>
            </div>
            <div className="flex-1 overflow-auto min-h-0">
                <DRTable
                    donationRequests={filtered}
                    openDR={(dr) => setSelectedDRId(dr.id)}
                />
            </div>
        </>
    );
}
