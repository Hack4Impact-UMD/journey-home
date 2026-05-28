"use client";

import { RequestDetailsPage } from "@/components/client-requests/RequestDetails";
import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import { useClientRequests } from "@/lib/queries/client-requests";
import { useState, useMemo, useCallback, useEffect } from "react";
import { SearchBox } from "@/components/inventory/SearchBox";
import { SortOption } from "@/components/inventory/SortOption";
import { CaseMCRTable } from "@/components/client-requests/CaseMCRTable";
import { useAuth } from "@/contexts/AuthContext";
import { useExport } from "@/contexts/ExportContext";
import { ClientRequest } from "@/types/client-requests";
import { escapeCSVField } from "@/lib/utils";

export default function ClientRequestsCaseManagerPage() {
    const { clientRequests, refetch: refetchClientRequests } = useClientRequests();

    const [selectedCRId, setSelectedCRId] = useState<string | null>(null);
    const selectedCR = clientRequests.find((cr) => cr.id === selectedCRId) ?? null;

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortBy, setSortBy] = useState<"asc" | "desc" | "none">("desc");

    const { state: authState } = useAuth();
    const uidCM = authState.userData?.uid;

    const { setExportHandler } = useExport();

    const filtered = useMemo(() => {
        return clientRequests
            .filter((request) => {
                if (request.caseManagerID !== uidCM) return false;
                if (request.status !== "Not Reviewed") return false;
                const norm = (s: string) => s.toLowerCase().replace(/\s/g, "");
                const q = norm(searchQuery);
                if (!q) return true;
                return [
                    `${request.client.firstName}${request.client.lastName}`,
                    request.client.phoneNumber,
                    request.client.hmis,
                ].some((field) => norm(field).includes(q));
            })
            .sort((req1, req2) => {
                if (sortBy === "none") {
                    return `${req1.client.lastName} ${req1.client.firstName}`.localeCompare(
                        `${req2.client.lastName} ${req2.client.firstName}`,
                    );
                } else if (sortBy === "asc") {
                    return (req1.date?.seconds ?? 0) - (req2.date?.seconds ?? 0);
                } else {
                    return (req2.date?.seconds ?? 0) - (req1.date?.seconds ?? 0);
                }
            });
    }, [clientRequests, searchQuery, sortBy, uidCM]);

    const handleExport = useCallback((requests: ClientRequest[]) => {
        const headers = [
            "First Name", "Last Name", "Email", "Phone Number",
            "Street Address", "Apt", "City", "State", "Zip Code",
            "HMIS", "Program Name",
            "Secondary Contact Name", "Secondary Contact Relationship", "Secondary Contact Phone",
            "Speaks English", "Adults in Family", "Children in Family", "Is Veteran",
            "Can Pick Up", "Was Chronic", "Has Moved In", "Move In Date", "Has Elevator", "Client Notes",
            "Date Submitted", "Item Name", "Item Quantity",
        ];
        const rows = requests.flatMap((r) => {
            const q = r.client.questions;
            const base = [
                r.client.firstName,
                r.client.lastName,
                r.client.email,
                r.client.phoneNumber,
                r.client.address.streetAddress,
                r.client.address.apt ?? "",
                r.client.address.city,
                r.client.address.state,
                r.client.address.zipCode,
                r.client.hmis,
                r.client.programName,
                r.client.secondaryContact.name,
                r.client.secondaryContact.relationship,
                r.client.secondaryContact.phone,
                q.clientSpeaksEnglish != null ? (q.clientSpeaksEnglish ? "Yes" : "No") : "",
                q.adultsInFamily != null ? String(q.adultsInFamily) : "",
                q.childrenInFamily != null ? String(q.childrenInFamily) : "",
                q.isVeteran ?? "",
                q.canPickUp != null ? (q.canPickUp ? "Yes" : "No") : "",
                q.wasChronic ?? "",
                q.hasMovedIn != null ? (q.hasMovedIn ? "Yes" : "No") : "",
                q.moveInDate ? q.moveInDate.toDate().toLocaleDateString() : "",
                q.hasElevator != null ? (q.hasElevator ? "Yes" : "No") : "",
                q.notes ?? "",
                r.date?.toDate().toLocaleDateString() ?? "",
            ];
            return r.items.map((i) => [...base, i.name, String(i.quantity)].map(escapeCSVField));
        });
        const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
        const blob = new Blob(["﻿" + csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "new-client-requests.csv";
        a.click();
        URL.revokeObjectURL(url);
    }, []);

    useEffect(() => {
        if (selectedCRId) {
            setExportHandler(null);
            return;
        }
        setExportHandler(() => handleExport(filtered));
        return () => setExportHandler(null);
    }, [filtered, handleExport, setExportHandler, selectedCRId]);

    return (
        <ProtectedRoute allow={["Case Manager"]}>
            <div className="flex flex-col flex-1 min-h-0">
                {selectedCR ? (
                    <div className="flex flex-col flex-1 min-h-0">
                        <button
                            className="w-16 h-8 text-white bg-primary rounded-xs text-sm self-start mb-[1.125rem]"
                            onClick={() => setSelectedCRId(null)}
                        >
                            Back
                        </button>
                        <span className="text-lg font-semibold text-text-1 mb-3">
                            {selectedCR.client.firstName} {selectedCR.client.lastName}
                        </span>
                        <div className="flex-1 overflow-auto min-h-0">
                            <RequestDetailsPage
                                client={selectedCR}
                                userRole="CaseManager"
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col mb-6">
                            <div className="flex flex-wrap gap-3">
                                <SearchBox
                                    value={searchQuery}
                                    onChange={setSearchQuery}
                                    onSubmit={() => refetchClientRequests()}
                                />
                                <SortOption
                                    label="Date"
                                    status={sortBy}
                                    onChange={(status) => setSortBy(status)}
                                />
                            </div>
                        </div>
                        <CaseMCRTable
                            clientRequests={filtered}
                            openCR={(cr) => setSelectedCRId(cr.id)}
                        />
                    </>
                )}
            </div>
        </ProtectedRoute>
    );
}
