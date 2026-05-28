"use client";

import { RequestDetailsPage } from "@/components/client-requests/RequestDetails";
import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import { useClientRequests } from "@/lib/queries/client-requests";
import { useState, useMemo } from "react";
import { SearchBox } from "@/components/inventory/SearchBox";
import { SortOption } from "@/components/inventory/SortOption";
import { DropdownMultiselect } from "@/components/inventory/DropdownMultiselect";
import { CaseMCRTable } from "@/components/client-requests/CaseMCRTable";
import { useAuth } from "@/contexts/AuthContext";
import { ReviewStatus } from "@/types/general";
import { exportClientRequestsCaseManager } from "@/lib/csv-exports";
import { Upload } from "lucide-react";

const statusOpts: ReviewStatus[] = ["Approved", "Denied"];

export default function ClientRequestsCaseManagerPage() {
    const { clientRequests, refetch: refetchClientRequests } = useClientRequests();

    const [selectedCRId, setSelectedCRId] = useState<string | null>(null);
    const selectedCR = clientRequests.find((cr) => cr.id === selectedCRId) ?? null;

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortBy, setSortBy] = useState<"asc" | "desc" | "none">("desc");
    const [selectedStatus, setStatus] = useState<ReviewStatus[]>(statusOpts);

    const { state: authState } = useAuth();
    const uidCM = authState.userData?.uid;

    const filtered = useMemo(() => {
        return clientRequests
            .filter((request) => {
                if (request.caseManagerID !== uidCM) return false;
                if (!selectedStatus.includes(request.status)) return false;
                if (request.status === "Not Reviewed") return false;
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
    }, [clientRequests, searchQuery, sortBy, selectedStatus, uidCM]);

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
                                <DropdownMultiselect
                                    label="Status"
                                    options={statusOpts}
                                    selected={selectedStatus}
                                    setSelected={setStatus}
                                />
                                <button
                                    type="button"
                                    className="bg-primary text-white px-3 py-1.5 text-sm flex items-center gap-1.5 shrink-0 ml-auto"
                                    onClick={() => exportClientRequestsCaseManager(filtered, "reviewed-client-requests.csv", true)}
                                >
                                    <Upload size={16} />
                                    Export Reviewed Requests
                                </button>
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
