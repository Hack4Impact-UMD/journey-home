"use client";

import { DRContentsTable } from "@/components/donation-requests/DRContentsTable";
import { DRTable } from "@/components/donation-requests/DRTable";
import { ItemReviewModal } from "@/components/donation-requests/ItemReviewModal";
import { SearchBox } from "@/components/inventory/SearchBox";
import { SortOption } from "@/components/inventory/SortOption";
import {
    getAllDonationRequests,
    setRequestItemStatus,
} from "@/lib/services/donations";
import {
    DonationItem,
    DonationRequest,
    DonationSearchParams,
} from "@/types/donations";
import { ReviewStatus } from "@/types/general";
import { useEffect, useState } from "react";

export default function DonationRequestsPage() {
    const [selectedDR, setSelectedDR] = useState<DonationRequest | null>(null);
    const [selectedItem, setSelectedItem] = useState<DonationItem | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchParams, setSearchParams] = useState<DonationSearchParams>({
        status: [],
        sortBy: "Date",
        ascending: false,
    });

    const [allDonationRequests, setAllDonationRequests] = useState<
        DonationRequest[]
    >([]);

    useEffect(() => {
        getAllDonationRequests().then((res) => {
            setAllDonationRequests(res);
        });
    }, []);

    function changeItemStatus(
        drID: string,
        itemID: string,
        status: ReviewStatus,
    ) {
        setAllDonationRequests((prevRequests) =>
            prevRequests.map((request) =>
                request.id == drID
                    ? {
                          ...request,
                          items: request.items.map((donationItem) =>
                              donationItem.item.id == itemID
                                  ? { ...donationItem, status: status }
                                  : donationItem,
                          ),
                      }
                    : request,
            ),
        );
        setSelectedDR((request) =>
            request
                ? {
                      ...request,
                      items: request.items.map((donationItem) =>
                          donationItem.item.id == itemID
                              ? { ...donationItem, status: status }
                              : donationItem,
                      ),
                  }
                : null,
        );
    }

    return selectedDR ? (
        <>
            {selectedItem && (
                <ItemReviewModal
                    dr={selectedDR}
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                    setStatus={(status) => {
                        setRequestItemStatus(
                            selectedDR.id,
                            selectedItem.item.id,
                            status,
                        ).then((res) => {
                            if (res) {
                                changeItemStatus(
                                    selectedDR.id,
                                    selectedItem.item.id,
                                    status,
                                );
                                setSelectedItem(null);
                            } else {
                                console.error(
                                    `Setting Request Item Status failed. ${selectedDR.id} ${selectedItem.item.id}`,
                                );
                            }
                        });
                    }}
                />
            )}
            <div className="flex flex-col">
                <div className="flex gap-3">
                    <button
                        className="w-16 h-8 text-white bg-primary rounded-xs text-sm"
                        onClick={() => setSelectedDR(null)}
                    >
                        Back
                    </button>
                    <SearchBox
                        value={""}
                        onChange={() => {}}
                        onSubmit={() => {}}
                    />
                    <SortOption
                        label="Date"
                        onChange={() => {}}
                        status="none"
                    />
                    <SortOption label="Qnt" onChange={() => {}} status="none" />
                </div>

                <span className="font-bold py-4.5">
                    {selectedDR.donor.firstName} {selectedDR.donor.lastName}
                </span>
            </div>
            <DRContentsTable request={selectedDR} openItem={setSelectedItem} />
        </>
    ) : (
        <>
            <div className="flex flex-col mb-6">
                <div className="flex gap-3">
                    <SearchBox
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onSubmit={() => {
                            getAllDonationRequests().then((res) => {
                                setAllDonationRequests(res);
                            });
                        }}
                    />
                    <SortOption
                        label="Date"
                        status={
                            searchParams.sortBy != "Date"
                                ? "none"
                                : searchParams.ascending
                                  ? "asc"
                                  : "desc"
                        }
                        onChange={(status) => {
                            setSearchParams((prev) => ({
                                ...prev,
                                sortBy: "Date",
                                ascending: status == "asc",
                            }));
                        }}
                    />
                    <SortOption
                        label="Qnt"
                        status={
                            searchParams.sortBy != "Quantity"
                                ? "none"
                                : searchParams.ascending
                                  ? "asc"
                                  : "desc"
                        }
                        onChange={(status) => {
                            setSearchParams((prev) => ({
                                ...prev,
                                sortBy: "Quantity",
                                ascending: status == "asc",
                            }));
                        }}
                    />
                </div>
            </div>
            <DRTable
                donationRequests={allDonationRequests
                    .filter((request) => {
                        const donorFullName =
                            `${request.donor.firstName} ${request.donor.lastName}`.toLowerCase();
                        const searchq = searchQuery.toLowerCase();

                        //status depends on the donationitems, need to map through that array to define the status.
                        if (searchParams.status.length != 0) {
                            const startedRequest = request.items.some(
                                (donItem) =>
                                    donItem.status === "Approved" ||
                                    donItem.status === "Denied",
                            );
                            const completedRequest = request.items.every(
                                (donItem) =>
                                    donItem.status === "Approved" ||
                                    donItem.status === "Denied",
                            );

                            let requestStat:
                                | "Not Reviewed"
                                | "Unfinished"
                                | "Finished";

                            if (!startedRequest) {
                                requestStat = "Not Reviewed";
                            } else if (!completedRequest) {
                                requestStat = "Unfinished";
                            } else {
                                requestStat = "Finished";
                            }

                            if (!searchParams.status.includes(requestStat)) {
                                return false;
                            }
                        }

                        return donorFullName.includes(searchq);
                    })

                    //still need to sort by category

                    .sort((req1, req2) => {
                        let diff;
                        if (searchParams.sortBy == "Date") {
                            diff = req1.date.seconds - req2.date.seconds;
                        } else if (searchParams.sortBy == "Quantity") {
                            diff = req1.items.length - req2.items.length;
                        } else {
                            // Sort by donor name
                            diff =
                                `${req1.donor.lastName} ${req1.donor.firstName}`.localeCompare(
                                    `${req2.donor.lastName} ${req2.donor.firstName}`,
                                );
                        }

                        if (!searchParams.ascending) {
                            diff *= -1;
                        }

                        return diff;
                    })}
                openDR={setSelectedDR}
            />
        </>
    );
}
