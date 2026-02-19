"use client"
import { DropdownMultiselect } from "@/components/inventory/DropdownMultiselect";
import { SearchBox } from "@/components/inventory/SearchBox";
import { SortOption } from "@/components/inventory/SortOption";
import Request, { getTotalItems } from "@/components/pickups-deliveries/Request";
import { useDeliveries, usePickups} from "@/lib/queries/pickups-deliveries";
import { useMemo, useState } from "react";

export default function Unscheduled() {
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOptions, setSelectedOptions] = useState<string[]>([
        "Pickups & Deliveries",
        "Pickups",
        "Deliveries",
    ]);
    const [sortBy, setSortBy] = useState<"Quantity">();
    const [sortAsc, setSortAsc] = useState<boolean>(false);
    const { pickups: approvedItems = [] } = usePickups(searchQuery, false);
    const { deliveries: deliveryItems = [] } = useDeliveries(searchQuery, false);
    const allOptions = [
        "Pickups & Deliveries",
        "Pickups",
        "Deliveries",
    ]
    const sortedItems = useMemo(() => {
        const allItems = [...approvedItems, ...deliveryItems];
        let filteredItems: typeof allItems = [];

        if (selectedOptions.includes("Pickups & Deliveries")) {
        filteredItems = allItems;
        } else {
        if (selectedOptions.includes("Pickups")) {
            filteredItems = [...filteredItems, ...allItems.filter(item => "donor" in item)];
        }
        if (selectedOptions.includes("Deliveries")) {
            filteredItems = [...filteredItems, ...allItems.filter(item => "client" in item)];
        }
        }
        filteredItems = Array.from(new Set(filteredItems));
        return filteredItems.toSorted((a, b) => {
            const totalA = getTotalItems(a);
            const totalB = getTotalItems(b);
            return sortAsc ? totalA - totalB : totalB - totalA;
        });
    }, [approvedItems, deliveryItems, selectedOptions, sortBy, sortAsc]);
    //had to remove sortBy for lint
    return (
        <div>
            <div className="flex flex-col mb-6">
                <div className="flex">
                    <div className="flex flex-wrap gap-3">
                        <SearchBox
                            value={searchInput}
                            onChange={setSearchInput}
                            onSubmit={() => setSearchQuery(searchInput)}
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
                        <DropdownMultiselect
                            label="Pickups & Deliveries"
                            options={allOptions}
                            selected={selectedOptions}
                            setSelected={setSelectedOptions}
                        />
                    </div>                     
                </div>
                                    
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                 {sortedItems.map((donation) => (
                    <Request donation={donation} key={donation.id} />
                ))}
            </div>
        </div>
    )
}
