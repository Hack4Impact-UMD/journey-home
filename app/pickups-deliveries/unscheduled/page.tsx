"use client"
import { DropdownMultiselect } from "@/components/inventory/DropdownMultiselect";
import { SearchBox } from "@/components/inventory/SearchBox";
import { SortOption } from "@/components/inventory/SortOption";
import Request, { getTotalItems } from "@/components/pickups-deliveries/Request";
import { useDeliveries, usePickups} from "@/lib/queries/pickups-deliveries";
import { useMemo, useState } from "react";

export default function UnscheduledTasksPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOptions, setSelectedOptions] = useState<string[]>([
        "Pickups",
        "Deliveries",
    ]);
    const [sortBy, setSortBy] = useState<"Quantity">();
    const [sortAsc, setSortAsc] = useState<boolean>(false);
    const {
        pickups: approvedItems = [],
        refetch: refetchPickups
    } = usePickups(false);
    const {
        deliveries: deliveryItems = [],
        refetch: refetchDeliveries
    } = useDeliveries(false);
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
                }).sort((a, b) => { //will change this later once clientRequest date gets implemented
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
