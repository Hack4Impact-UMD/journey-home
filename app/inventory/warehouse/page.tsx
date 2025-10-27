"use client";

import GalleryItem from "@/components/GalleryItem";

export default function WarehousePage() {

    return (
         <div className="p-6">
            <div className="mb-4 text-lg font-semibold">Search bar here and sort/filter here</div>

            {/* Here is a 4-by-4 grid for now just to get sizing right. Later on I'll code it so it'll only show as 
            many GalleryItem components as there are items in the database*/}
            <div className="grid grid-cols-4 gap-6">
                {Array.from({ length: 16 }).map((_, i) => (
                <GalleryItem key={i} />
                ))}
            </div>
        </div>
    )
}