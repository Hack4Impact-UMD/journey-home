"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import SideNavbar from "@/components/general/SideNav";
import TopNavbar from "@/components/general/TopNav";
import { SearchBox } from "@/components/inventory/SearchBox";
import { SortOption } from "@/components/inventory/SortOption";
import { DropdownMultiselect } from "@/components/inventory/DropdownMultiselect";
import { AdminCRTable } from "@/components/client-requests/AdminCRTable";
import { RequestDetailsPage } from "@/components/client-requests/RequestDetails";
import { useClientRequests } from "@/lib/queries/client-requests";
import { useState } from "react";
import { ReviewStatus } from "@/types/general";
import { toast } from "sonner";

export default function ClientRequestsAdminPage() {
    const { clientRequests, refetch: refetchClientRequests, setClientRequestToast } = useClientRequests();
    const [ selectedGroup, changeGroup ] = useState<string>("All");
    
    const statusOpts: ReviewStatus[] = ["Not Reviewed", "Approved", "Denied"];

    const [selectedCRId, setSelectedCRId] = useState<string | null>(null);
    const selectedCR = clientRequests.find((cr) => cr.id === selectedCRId) ?? null;

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortBy, setSortBy] = useState<"asc" | "desc" | "none">("none") //don't need to worry about search params here bc only sorting by date!
    const [selectedStatus, setStatus] = useState<ReviewStatus[]>(statusOpts);

    const handleUpdateStatus = async (status: ReviewStatus) => {
        if (!selectedCR) return;

        toast.promise(
            setClientRequestToast({
                ...selectedCR,
                status
            }).then(() => {
                setSelectedCRId(null);
            }),
            {
                loading: "Updating status...",
                success: "Status updated successfully!",
                error: "Error: Couldn't update status",
            }
        );
    }

    return (
        <ProtectedRoute allow={["Admin"]}>
            <div className="h-full w-full flex flex-col font-family-roboto">
                <TopNavbar />
                <div className="flex flex-1">
                    <SideNavbar />
                    <div className="flex-1 bg-[#F7F7F7] py-4 px-6 flex flex-col">
                        <h1 className="text-2xl text-primary font-extrabold">
                            Client Requests
                        </h1>
                        {/*top bar of options, need to filter the displayed info based on that*/}
                        <div className="flex gap-8 text-sm">
                            <h1 onClick={() => changeGroup("All")} 
                                className= {`py-4${
                                    selectedGroup == "All"
                                        ? " border-b-2 border-primary text-primary"
                                        : ""
                            }`}>
                                All
                            </h1>
                            <h1 onClick={() => changeGroup("New")}
                                className= {`py-4${
                                    selectedGroup == "New"
                                        ? " border-b-2 border-primary text-primary"
                                        : ""
                            }`}>
                                New
                            </h1>
                            <h1 onClick={() => changeGroup("Reviewed")}
                                className= {`py-4${
                                    selectedGroup == "Reviewed"
                                        ? " border-b-2 border-primary text-primary"
                                        : ""
                            }`}>
                                Reviewed
                            </h1>
                        </div>
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
                                            userRole="Admin"
                                        />
                                    </div>
                                    <div className="flex gap-2 mt-8 justify-end">
                                        <button
                                            className="text-sm bg-primary rounded-xs h-8 px-4 text-white"
                                            onClick={() => handleUpdateStatus("Approved")}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="text-sm rounded-xs h-8 px-4 border border-light-border"
                                             onClick={() => handleUpdateStatus("Denied")}
                                        >
                                            Deny
                                        </button>
                                    </div>
                                </div>
                            ) : (
                           <div>
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
                                <AdminCRTable clientRequests={clientRequests
                                        .filter((request) => {
                                            if (!selectedStatus.includes(request.status)) return false;

                                            const clientFullName =
                                                `${request.client.firstName} ${request.client.lastName}`.toLowerCase();

                                            //making it easier to return when i have a specific group selected, i think i did it right
                                            if (selectedGroup === "New" && request.status !== "Not Reviewed") return false;
                                            if (selectedGroup === "Reviewed" && request.status === "Not Reviewed") return false;
                                            
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
                          
                        
                        </div>
                            )}
                            </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
