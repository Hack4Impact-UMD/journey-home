"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import { SearchBox } from "@/components/inventory/SearchBox";
import { SortOption } from "@/components/inventory/SortOption";
import { AdminCRTable } from "@/components/client-requests/AdminCRTable";
import { RequestDetailsPage } from "@/components/client-requests/RequestDetails";
import { ConfirmModal } from "@/components/general/ConfirmModal";
import { DebounceTextbox } from "@/components/general/DebounceTextbox";
import { useClientRequests } from "@/lib/queries/client-requests";
import { useAllActiveAccounts } from "@/lib/queries/users";
import { useState } from "react";

export default function ClientRequestsAdminPage() {
    const { clientRequests, refetch: refetchClientRequests, setClientRequest, setClientRequestToast } = useClientRequests();
    const { allAccounts } = useAllActiveAccounts();
    const userById = new Map(allAccounts.map((u) => [u.uid, u]));

    const [selectedCRId, setSelectedCRId] = useState<string | null>(null);
    const selectedCR = clientRequests.find((cr) => cr.id === selectedCRId) ?? null;

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortBy, setSortBy] = useState<"asc" | "desc" | "none">("desc");

    const [editSinceLabel, setEditSinceLabel] = useState<string | null>("Saved");
    const [pendingAction, setPendingAction] = useState<{ status: "Approved" | "Denied" } | null>(null);
    const pendingCaseManager = selectedCR ? (userById.get(selectedCR.caseManagerID) ?? null) : null;

    const handleConfirm = async () => {
        if (!pendingAction || !selectedCR) return;
        await setClientRequestToast({ ...selectedCR, status: pendingAction.status });
        setPendingAction(null);
        setSelectedCRId(null);
    };

    return (
        <ProtectedRoute allow={["Admin"]}>
            {selectedCR ? (
                <div className="flex flex-col h-full">
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
                            userRole="Admin"
                        />
                    </div>
                    <div className="mt-6">
                        <span className="font-bold text-text-1">Admin Notes</span>
                        <div className="h-20 w-full mt-2">
                            <DebounceTextbox
                                key={selectedCR.id}
                                initialValue={selectedCR.notes}
                                debounceMs={1500}
                                onUpdate={(value) => setClientRequest({ ...selectedCR, notes: value })}
                                setEditSince={setEditSinceLabel}
                                placeholder="Add notes..."
                            />
                        </div>
                        <span className="text-xs text-[#7D7D7D] mt-2 block h-3.5">{editSinceLabel}</span>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <button
                            className="text-sm bg-primary rounded-xs h-8 px-4 text-white"
                            onClick={() => setPendingAction({ status: "Approved" })}
                        >
                            Approve
                        </button>
                        <button
                            className="text-sm rounded-xs h-8 px-4 border border-light-border"
                            onClick={() => setPendingAction({ status: "Denied" })}
                        >
                            Deny
                        </button>
                    </div>
                    {pendingAction && (
                        <ConfirmModal
                            title={pendingAction.status === "Approved" ? "Approve request?" : "Deny request?"}
                            message={`${pendingAction.status === "Approved" ? "Approve" : "Deny"} ${selectedCR.client.firstName} ${selectedCR.client.lastName}'s request submitted by ${pendingCaseManager ? `${pendingCaseManager.firstName} ${pendingCaseManager.lastName}` : "this case manager"}?`}
                            onConfirm={handleConfirm}
                            onCancel={() => setPendingAction(null)}
                        />
                    )}
                </div>
            ) : (
                <div>
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
                    <AdminCRTable
                        clientRequests={clientRequests
                            .filter((request) => {
                                if (request.status !== "Not Reviewed") return false;
                                const norm = (s: string) => s.toLowerCase().replace(/\s/g, "");
                                const q = norm(searchQuery);
                                if (!q) return true;
                                const cm = userById.get(request.caseManagerID);
                                return [
                                    `${request.client.firstName}${request.client.lastName}`,
                                    request.client.email,
                                    request.client.phoneNumber,
                                    cm ? `${cm.firstName}${cm.lastName}` : "",
                                    cm?.email ?? "",
                                ].some((field) => norm(field).includes(q));
                            })
                            .sort((req1, req2) => {
                                let diff;
                                if (sortBy === "none") {
                                    diff = `${req1.client.lastName} ${req1.client.firstName}`.localeCompare(
                                        `${req2.client.lastName} ${req2.client.firstName}`,
                                    );
                                } else if (sortBy === "asc") {
                                    diff = (req1.date?.seconds ?? 0) - (req2.date?.seconds ?? 0);
                                } else {
                                    diff = (req2.date?.seconds ?? 0) - (req1.date?.seconds ?? 0);
                                }
                                return diff;
                            })
                        }
                        openCR={(cr) => setSelectedCRId(cr.id)}
                        onUpdateStatus={async (cr, status) => setClientRequestToast({ ...cr, status })}
                    />
                </div>
            )}
        </ProtectedRoute>
    );
}
