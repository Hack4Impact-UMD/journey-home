"use client";

import { InventoryRecord } from "../types/inventory";
import InventoryItem from "../app/inventory/warehouse/page";

type GalleryItemProps = {
  item: InventoryRecord;
};

export default function GalleryItem({item}: GalleryItemProps) {
    return (
        <div className="w-full max-w-md aspect-[15/21] flex flex-col justify-start p-4 bg-white border-1 relative border-gray-200 shadow-lg rounded-lg">
            <div className="w-80 aspect-square bg-white border border-grey rounded-lg"> 
                <div className="w-1/12 aspect-square bg-white border border-black relative top-1/18 left-6/7 flex items-center justify-center pt-4"> 

                </div>
                picture
            </div>
            <div className="justify-start pt-6 font-bold text-2xl">{item.name}</div>
            <div className="text-xl">
                Category {item.category}
            </div>
            <div className=" text-lg text-gray-400">{item.dateAdded.toDate().toLocaleDateString()}</div>
        </div>
    )

}
