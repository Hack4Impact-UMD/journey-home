"use client"
import Request, { getTotalItems } from "@/components/pickups-deliveries/Request";
import { DropdownMultiselect } from "@/components/inventory/DropdownMultiselect";
import { SearchBox } from "@/components/inventory/SearchBox";
import { SortOption } from "@/components/inventory/SortOption";
import { useState, useMemo } from "react";
import { useDonationRequests } from "@/lib/queries/donation-requests";
import { useClientRequests } from "@/lib/queries/client-requests";

export default function ScheduledTasksPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOptions, setSelectedOptions] = useState<string[]>([
        "Pickups",
        "Deliveries",
    ]);
    const [sortBy, setSortBy] = useState<"Quantity" | "Date">("Date");
    const [sortAsc, setSortAsc] = useState<boolean>(true);
    const { donationRequests, refetch: refetchPickups } = useDonationRequests();
    const { clientRequests, refetch: refetchDeliveries } = useClientRequests();

    const approvedItems = useMemo(
        () => donationRequests.filter(
            (dr) => dr.associatedTimeBlockID !== null &&
                    dr.items.every((item) => item.status === "Approved" || item.status === "Denied") &&
                    dr.items.some((item) => item.status === "Approved")
        ),
        [donationRequests]
    );

    const deliveryItems = useMemo(
        () => clientRequests.filter(
            (cr) => cr.associatedTimeBlockID !== null
        ),
        [clientRequests]
    );
    const allOptions = [
        "Pickups",
        "Deliveries",
    ]
    return (
        <div>
            <div className="flex flex-col mb-6">
                <div className="flex">
                    <div className="flex flex-wrap gap-3">
                        <SearchBox
                            value={searchQuery}
                            onChange={setSearchQuery}
                            onSubmit={() => {
                                refetchPickups();
                                refetchDeliveries();
                            }}
                        />
                        <SortOption
                            label="Qnt"
                            status={
                            sortBy != "Quantity"
                                ? "none"
                                : sortAsc
                                ? "asc"
                                : "desc"
                            }
                            onChange={(status) => {
                                setSortBy("Quantity");
                                setSortAsc(status == "asc");
                            }}
                        />
                        {/* Date doesn't work and only sorts due to clientRequests not having a date field */}
                        <SortOption
                            label="Date"
                            status={
                                sortBy != "Date"
                                    ? "none"
                                    : sortAsc
                                    ? "asc"
                                    : "desc"
                            }
                            onChange={(status) => {
                                setSortBy("Date");
                                setSortAsc(status == "asc");
                            }}
                        />
                        <DropdownMultiselect
                            label="Task Type"
                            options={allOptions}
                            selected={selectedOptions}
                            setSelected={setSelectedOptions}
                        />
                    </div>                     
                </div>
                                        
            </div>
            <div className="w-full h-full flex flex-wrap gap-x-3 gap-y-6 content-start">
                {[...approvedItems, ...deliveryItems]
                    .filter(item =>
                    selectedOptions.includes("All") ||
                    ("donor" in item && selectedOptions.includes("Pickups")) ||
                    ("client" in item && selectedOptions.includes("Deliveries"))
                ).filter(item => {
                    const query = searchQuery.toLowerCase().trim();
                    if (!query) return true; 
                    const searchable = JSON.stringify(item).toLowerCase();
                    return searchable.includes(query);
                }).sort((a, b) => {
                    const totalA = getTotalItems(a);
                    const totalB = getTotalItems(b);
                    return sortAsc ? totalA - totalB : totalB - totalA;
                }).map(item => (
                    <Request donation={item} key={item.id} />
                ))
            }
            </div>
        </div>
    )
}