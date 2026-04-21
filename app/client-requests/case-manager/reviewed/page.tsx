"use client";

import { RequestDetailsPage } from "@/components/client-requests/RequestDetails";
import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import { useClientRequests } from "@/lib/queries/client-requests";
import { useState } from "react";
import { SearchBox } from "@/components/inventory/SearchBox";
import { SortOption } from "@/components/inventory/SortOption";
import { DropdownMultiselect } from "@/components/inventory/DropdownMultiselect";
import { CaseMCRTable } from "@/components/client-requests/CaseMCRTable";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { ReviewStatus } from "@/types/general";

export default function ClientRequestsCaseManagerPage() {
    const { clientRequests, refetch: refetchClientRequests } = useClientRequests();

    const statusOpts: ReviewStatus[] = ["Approved", "Denied"];
    
    const [selectedCRId, setSelectedCRId] = useState<string | null>(null);
    const selectedCR = clientRequests.find((cr) => cr.id === selectedCRId) ?? null;

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortBy, setSortBy] = useState<"asc" | "desc" | "none">("none")
    const [selectedStatus, setStatus] = useState<ReviewStatus[]>(statusOpts);

    const currCM = useAuth()
    const uidCM = currCM.state.userData?.uid

    return (
        <ProtectedRoute allow={["Case Manager"]}>
            {/*actual content*/}
            <div className="bg-background rounded-xl flex-wrap my-2 flex-1 py-4 px-6 min-h-0 overflow-hidden">
                {selectedCR ? (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-lg font-semibold text-text-1">
                            {selectedCR.client.firstName} {selectedCR.client.lastName}
                            </span>
                            <button
                                className="w-16 h-8 text-white bg-primary rounded-xs text-sm mb-4"
                                onClick={() => setSelectedCRId(null)}
                            >
                                Back
                            </button>
                        </div>
                        <div className="h-90 overflow-scroll overflow-x-hidden">
                            <RequestDetailsPage
                                client={selectedCR}
                                userRole="CaseManager"
                            />
                        </div>
                    </div>
                ) : (               
                <>
                    <div className="flex flex-col mb-6">
                        <div className="flex gap-3">
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
                        </div>
                    </div>

                    <CaseMCRTable
                        clientRequests={clientRequests
                            .filter((request) => {
                                if (request.caseManagerID !== uidCM) return false;
                                if (!selectedStatus.includes(request.status)) return false;

                                const clientFullName =
                                    `${request.client.firstName} ${request.client.lastName}`.toLowerCase();

                                //making it easier to return when i have a specific group selected, i think i did it right
                                if (request.status === "Not Reviewed") return false;
                                
                                return clientFullName.includes(searchQuery.toLowerCase());
                            })
                            .sort((req1, req2) => {
                                let diff;
                                //by name if default
                                if (sortBy === "none"){
                                    diff =
                                        `${req1.client.lastName} ${req1.client.firstName}`.localeCompare(
                                            `${req2.client.lastName} ${req2.client.firstName}`,
                                    );
                                }
                                //by date ascending
                                else if (sortBy === "asc"){
                                    diff = req1.date.seconds - req2.date.seconds;
                                }
                                //by date descending
                                else{
                                    diff = req2.date.seconds - req1.date.seconds;
                                }

                                return diff;
                            })
                        }
                        openCR={(cr) => setSelectedCRId(cr.id)}
                    />
                </>
             )}
            </div>
            <div className="mt-4">
                <Link
                    href="/client-request-form"
                    className="bg-primary text-white text-sm px-4 py-2 rounded-xs"
                >
                    Create Request
                </Link>
            </div>
        </ProtectedRoute>
    );
}
