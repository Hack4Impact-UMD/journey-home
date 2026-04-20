"use client";

import { DRContentsGallery } from "@/components/donation-requests/DRContentsGallery";
import { DRContentsTable } from "@/components/donation-requests/DRContentsTable";
import { DRDetails } from "@/components/donation-requests/DRDetails";
import { DRTable } from "@/components/donation-requests/DRTable";
import { ItemReviewModal } from "@/components/donation-requests/ItemReviewModal";
import { SortIcon } from "@/components/icons/SortIcon";
import { SearchBox } from "@/components/inventory/SearchBox";
import { SortOption } from "@/components/inventory/SortOption";
import { useDonationRequests } from "@/lib/queries/donation-requests";
import { ReviewStatus } from "@/types/general";
import { DonationItem, DonationSearchParams } from "@/types/donations";
import { useState } from "react";

function ListIcon({ active }: { active: boolean }) {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
            className={active ? "text-primary" : "text-gray-400"}>
            <rect x="1" y="3" width="16" height="2" rx="1" fill="currentColor" />
            <rect x="1" y="8" width="16" height="2" rx="1" fill="currentColor" />
            <rect x="1" y="13" width="16" height="2" rx="1" fill="currentColor" />
        </svg>
    );
}

function GridIcon({ active }: { active: boolean }) {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
            className={active ? "text-primary" : "text-gray-400"}>
            <rect x="1" y="1" width="7" height="7" rx="1" fill="currentColor" />
            <rect x="10" y="1" width="7" height="7" rx="1" fill="currentColor" />
            <rect x="1" y="10" width="7" height="7" rx="1" fill="currentColor" />
            <rect x="10" y="10" width="7" height="7" rx="1" fill="currentColor" />
        </svg>
    );
}

function ChevronDown() {
    return (
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

const STATUS_OPTIONS: ReviewStatus[] = ["Not Reviewed", "Approved", "Denied"];

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
    const [viewMode, setViewMode] = useState<"list" | "gallery">("list");

    const [itemSearchQuery, setItemSearchQuery] = useState<string>("");
    const [itemSortBy, setItemSortBy] = useState<"Quantity" | "Date">("Date");
    const [itemAscending, setItemAscending] = useState<boolean>(false);
    const [itemStatusFilter, setItemStatusFilter] = useState<ReviewStatus | null>(null);
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

    const filteredItems = selectedDR
        ? selectedDR.items
              .filter((item) => {
                  const matchesSearch = item.item.name
                      .toLowerCase()
                      .includes(itemSearchQuery.toLowerCase());
                  const matchesStatus = itemStatusFilter
                      ? item.status === itemStatusFilter
                      : true;
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
            <div className="flex gap-3 items-center">
                <button
                    className="w-16 h-8 text-white bg-primary rounded-xs text-sm shrink-0"
                    onClick={() => setSelectedDRId(null)}
                >
                    Back
                </button>
                <SearchBox
                    value={itemSearchQuery}
                    onChange={setItemSearchQuery}
                    onSubmit={() => {}}
                />
                <button
                    className="border border-light-border rounded-xs flex justify-center items-center px-4 gap-1.5 h-8 text-sm"
                    onClick={() => {
                        if (itemSortBy === "Quantity") {
                            setItemAscending((prev) => !prev);
                        } else {
                            setItemSortBy("Quantity");
                            setItemAscending(false);
                        }
                    }}
                >
                    <span className={itemSortBy === "Quantity" ? "font-semibold" : ""}>Qnt</span>
                    <SortIcon status={itemSortBy === "Quantity" ? (itemAscending ? "asc" : "desc") : "none"} />
                </button>
                <button
                    className="border border-light-border rounded-xs flex justify-center items-center px-4 gap-1.5 h-8 text-sm"
                    onClick={() => {
                        if (itemSortBy === "Date") {
                            setItemAscending((prev) => !prev);
                        } else {
                            setItemSortBy("Date");
                            setItemAscending(false);
                        }
                    }}
                >
                    <span className={itemSortBy === "Date" ? "font-semibold" : ""}>Date</span>
                    <SortIcon status={itemSortBy === "Date" ? (itemAscending ? "asc" : "desc") : "none"} />
                </button>

                <div className="relative">
                    <button
                        className="border border-light-border rounded-xs flex justify-center items-center px-4 gap-1.5 h-8 text-sm"
                        onClick={() => setStatusDropdownOpen((o) => !o)}
                    >
                        <span className={itemStatusFilter ? "font-semibold" : ""}>{itemStatusFilter ?? "Status"}</span>
                        <ChevronDown />
                    </button>
                    {statusDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-light-border rounded-xs shadow z-10 min-w-max">
                            <button
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-50"
                                onClick={() => {
                                    setItemStatusFilter(null);
                                    setStatusDropdownOpen(false);
                                }}
                            >
                                All
                            </button>
                            {STATUS_OPTIONS.map((s) => (
                                <button
                                    key={s}
                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-50"
                                    onClick={() => {
                                        setItemStatusFilter(s);
                                        setStatusDropdownOpen(false);
                                    }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="ml-auto flex items-center gap-1">
                    <button
                        className={`w-8 h-8 flex items-center justify-center border border-light-border ${viewMode === "list" ? "bg-[#FAFAFB] text-primary" : "bg-white text-gray-400"}`}
                        onClick={() => setViewMode("list")}
                    >
                        <ListIcon active={viewMode === "list"} />
                    </button>
                    <button
                        className={`w-8 h-8 flex items-center justify-center border border-light-border ${viewMode === "gallery" ? "bg-[#FAFAFB] text-primary" : "bg-white text-gray-400"}`}
                        onClick={() => setViewMode("gallery")}
                    >
                        <GridIcon active={viewMode === "gallery"} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto min-h-0 mt-2">
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
                <DRDetails dr={selectedDR} />
            </div>
        </>
    ) : (
        <>
            <div className="flex flex-col mb-6">
                <div className="flex gap-3">
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
                    openDR={(dr) => setSelectedDRId(dr.id)}
                />
            </div>
        </>
    );
}