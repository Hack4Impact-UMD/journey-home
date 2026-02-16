"use client"
import Request from "@/components/pickups-deliveries/Request";
import { DropdownMultiselect } from "@/components/inventory/DropdownMultiselect";
import { SearchBox } from "@/components/inventory/SearchBox";
import { SortOption } from "@/components/inventory/SortOption";
import { useState } from "react";

export default function completed() {
    const [searchQuery, setSearchQuery] = useState<string>("");
        const [selectedOptions, setSelectedOptions] = useState<string[]>([
            "Pickups & Deliveries",
            "Pickups",
            "Large"
        ]);
        const [sortBy, setSortBy] = useState<"Quantity" | "Date">("Date");
        const [sortAsc, setSortAsc] = useState<boolean>(false);
        return (
            <div>
            <div className="flex flex-col mb-6">
                <div className="flex">
                    <div className="flex flex-wrap gap-3">
                        <SearchBox
                            value="Search"
                            onChange={setSearchQuery}
                            onSubmit={() =>
                            {setSearchQuery}
                            }
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
                            label="Pickups & Deliveries"
                            options={selectedOptions}
                            selected={selectedOptions}
                            setSelected={setSelectedOptions}
                        />
                    </div>                     
                </div>
                                    
            </div>
            <div>
                {/* <Request/> */}
            </div>
            </div>
)}