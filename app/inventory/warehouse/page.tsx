"use client";

import GalleryItem from "@/components/GalleryItem";
import { InventoryRecord } from "@/types/inventory";
import { Timestamp } from "firebase/firestore";

const ITEMS: InventoryRecord[] = [
  { id: "1", name: "item1", photos: [], category: "Couches", notes: "N/A", quantity: 1, size: "Large", dateAdded: Timestamp.fromDate(new Date("2025-10-27T16:00:00Z")), donorEmail: null},
  { id: "2", name: "item2", photos: [], category: "Couches", notes: "N/A", quantity: 1, size: "Large", dateAdded: Timestamp.fromDate(new Date("2025-10-28T16:00:00Z")), donorEmail: null},
  { id: "3", name: "item3", photos: [], category: "Couches", notes: "N/A", quantity: 1, size: "Large", dateAdded: Timestamp.fromDate(new Date("2025-10-29T16:00:00Z")), donorEmail: null},
];

export default function WarehousePage() {

    return (
         <div className="p-6">
            <div className="mb-4 text-lg font-semibold">Search bar here and sort/filter here</div>

            {/* Here is a 4-by-4 grid for now just to get sizing right. Later on I'll code it so it'll only show as 
            many GalleryItem components as there are items in the database*/}
            <div className="grid grid-cols-4 gap-6">
                {Array.from({ length: 16 }).map((_, i) => (
                <GalleryItem key={i} item={ITEMS[1]}/>
                ))}
            </div>
        </div>
    )
}