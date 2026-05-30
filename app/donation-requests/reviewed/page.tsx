"use client";

import { DRContentsGallery } from "@/components/donation-requests/DRContentsGallery";
import { DRContentsTable } from "@/components/donation-requests/DRContentsTable";
import { DRDetails } from "@/components/donation-requests/DRDetails";
import { DRTable } from "@/components/donation-requests/DRTable";
import { ItemReviewModal } from "@/components/donation-requests/ItemReviewModal";
import { DropdownMultiselect } from "@/components/inventory/DropdownMultiselect";
import { SearchBox } from "@/components/inventory/SearchBox";
import { SortOption } from "@/components/inventory/SortOption";
import { useDonationRequests } from "@/lib/queries/donation-requests";
import { ReviewStatus } from "@/types/general";
import { DonationItem, DonationSearchParams } from "@/types/donations";
import { ListIcon, SquaresFourIcon } from "@phosphor-icons/react";
import { useState } from "react";

export default function ReviewedRequestsPage() {
    const { donationRequests, setDonationRequestToast, refetch } =
        useDonationRequests();
    const [selectedDRId, setSelectedDRId] = useState<string | null>(null);
    const selectedDR =
        donationRequests.find((dr) => dr.id === selectedDRId) ?? null;
    const [selectedItem, setSelectedItem] = useState<DonationItem | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchParams, setSearchParams] = useState<DonationSearchParams>({
        status: [],
        sortBy: "Date",
        ascending: false,
    });
    const [viewMode, setViewMode] = useState<"list" | "gallery">("gallery");

    const [itemSearchQuery, setItemSearchQuery] = useState<string>("");
    const [itemSortBy, setItemSortBy] = useState<"Quantity" | "Date">("Date");
    const [itemAscending, setItemAscending] = useState<boolean>(false);
    const [itemStatusFilter, setItemStatusFilter] = useState<ReviewStatus[]>([]);

    function selectDR(id: string | null) {
        setSelectedDRId(id);
        setItemSearchQuery("");
        setItemSortBy("Date");
        setItemAscending(false);
        setItemStatusFilter([]);
    }

    const filteredItems = selectedDR
        ? selectedDR.items
              .filter((item) => {
                  const matchesSearch = item.item.name
                      .toLowerCase()
                      .includes(itemSearchQuery.toLowerCase());
                  const matchesStatus =
                      itemStatusFilter.length === 0 ||
                      itemStatusFilter.includes(item.status);
                  return matchesSearch && matchesStatus;
              })
              .sort((a, b) => {
                  let diff;
                  if (itemSortBy === "Date") {
                      diff = a.item.dateAdded.seconds - b.item.dateAdded.seconds;
                  } else {
                      diff = a.item.quantity - b.item.quantity;
                  }
                  return itemAscending ? diff : -diff;
              })
        : [];

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
            <div className="flex flex-wrap gap-3 items-center mb-5.75">
                <button
                    className="w-16 h-8 text-white bg-primary rounded-xs text-sm shrink-0"
                    onClick={() => selectDR(null)}
                >
                    Back
                </button>
                <SearchBox
                    value={itemSearchQuery}
                    onChange={setItemSearchQuery}
                    onSubmit={() => {}}
                />
                <SortOption
                    label="Qnt"
                    status={itemSortBy === "Quantity" ? (itemAscending ? "asc" : "desc") : "none"}
                    onChange={(status) => {
                        setItemSortBy("Quantity");
                        setItemAscending(status === "asc");
                    }}
                />
                <SortOption
                    label="Date"
                    status={itemSortBy === "Date" ? (itemAscending ? "asc" : "desc") : "none"}
                    onChange={(status) => {
                        setItemSortBy("Date");
                        setItemAscending(status === "asc");
                    }}
                />
                <DropdownMultiselect<ReviewStatus>
                    label="Status"
                    options={["Not Reviewed", "Approved", "Denied"]}
                    selected={itemStatusFilter}
                    setSelected={setItemStatusFilter}
                />
                <div className="ml-auto flex items-center gap-2">
                    <button
                        className="w-8 h-8 flex items-center justify-center"
                        onClick={() => setViewMode("gallery")}
                    >
                        <SquaresFourIcon size={24} className={viewMode === "gallery" ? "text-[#505050]" : "text-gray-300"} />
                    </button>
                    <button
                        className="w-8 h-8 flex items-center justify-center"
                        onClick={() => setViewMode("list")}
                    >
                        <ListIcon size={24} className={viewMode === "list" ? "text-[#505050]" : "text-gray-300"} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto min-h-0 pr-4">
                <div className="">
                    {viewMode === "list" ? (
                        <DRContentsTable
                            request={{ ...selectedDR, items: filteredItems }}
                            openItem={setSelectedItem}
                        />
                    ) : (
                        <DRContentsGallery
                            request={{ ...selectedDR, items: filteredItems }}
                            openItem={setSelectedItem}
                        />
                    )}
                </div>
                <div className="mt-9.25">
                    <DRDetails dr={selectedDR} />
                </div>
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
            <div className="flex-1 overflow-auto min-h-0">
                <DRTable
                    donationRequests={donationRequests
                        .filter((request) => {
                            const donorFullName =
                                `${request.donor.firstName} ${request.donor.lastName}`.toLowerCase();
                            const searchq = searchQuery.toLowerCase();

                            const completedRequest = request.items.every(
                                (donItem) =>
                                    donItem.status === "Approved" ||
                                    donItem.status === "Denied",
                            );
                            if (!completedRequest) return false;

                            if (searchParams.status.length != 0) {
                                if (!searchParams.status.includes("Finished")) {
                                    return false;
                                }
                            }

                            return donorFullName.includes(searchq);
                        })
                        .sort((req1, req2) => {
                            let diff;
                            if (searchParams.sortBy == "Date") {
                                diff = req1.date.seconds - req2.date.seconds;
                            } else if (searchParams.sortBy == "Quantity") {
                                diff = req1.items.length - req2.items.length;
                            } else {
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
                    openDR={(dr) => selectDR(dr.id)}
                />
            </div>
        </>
    );
}
