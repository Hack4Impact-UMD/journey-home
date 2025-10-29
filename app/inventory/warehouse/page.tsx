"use client";

import GalleryItem from "@/components/GalleryItem";
import SearchBar from "@/components/SearchBar";
import { InventoryRecord } from "@/types/inventory";
import { Timestamp } from "firebase/firestore";
import { useState } from "react";

const ITEMS: InventoryRecord[] = [
    { id: "1", name: "item1", photos: [], category: "Couches", notes: "N/A", quantity: 1, size: "Large", dateAdded: Timestamp.fromDate(new Date("2025-10-27T16:00:00Z")), donorEmail: null},
    { id: "2", name: "item2", photos: [], category: "Chairs", notes: "N/A", quantity: 1, size: "Medium", dateAdded: Timestamp.fromDate(new Date("2025-10-28T16:00:00Z")), donorEmail: null},
    { id: "3", name: "item3", photos: [], category: "Tables", notes: "N/A", quantity: 1, size: "Small", dateAdded: Timestamp.fromDate(new Date("2025-10-29T16:00:00Z")), donorEmail: null},
    { id: "4", name: "item4", photos: [], category: "Tables", notes: "N/A", quantity: 1, size: "Small", dateAdded: Timestamp.fromDate(new Date("2025-10-30T16:00:00Z")), donorEmail: null},
    { id: "5", name: "item5", photos: [], category: "Tables", notes: "N/A", quantity: 1, size: "Small", dateAdded: Timestamp.fromDate(new Date("2025-10-31T16:00:00Z")), donorEmail: null},
];

export default function WarehousePage() {
    const [results, setResults] = useState<InventoryRecord[] | null>(null);

    //this will be changed when the adding functionality is implemented. for now, the purpose of this is to just see what the gallery looks like and when search 
    //is executed, nothing should show up since nothing is stored in firebase. 
    const itemsToDisplay = results === null ? ITEMS : results;
    return (
         <div className="p-6 flex flex-1 flex-col h-[calc(80vh-5rem)] min-h-0 overflow-hidden">
            <div className="text-lg font-semibold h-1/10 mb-9 flex flex-row"><SearchBar setResults={setResults} /> and sort/filter here</div>
            <div className="flex-1 overflow-y-auto min-h-0">
                <div className="grid grid-cols-4 gap-6">
                    {itemsToDisplay.map((item) => (
                        <GalleryItem key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </div>
    )
}