"use client";

import { InventoryRecord } from "../types/inventory";
import InventoryItem from "../app/inventory/warehouse/page";
import ItemTag, { categoryColors, quantityColors, sizeColors } from "./ItemTag";

type GalleryItemProps = {
    item: InventoryRecord;
};

export default function GalleryItem({item}: GalleryItemProps) {
    return (
        <div className="w-full max-w-md aspect-[15/21] flex flex-col justify-start p-[1.25em] bg-white border-1 relative border-gray-200 shadow-lg rounded-[.75em] cursor-pointer">
            <div className="relative w-full aspect-square bg-white border border-grey rounded-[.75em]"> 
                <div className="w-[1.5em] aspect-square bg-white border border-black absolute top-[0.75em] right-[0.75em] flex items-center justify-center pt-[1em]"> 

                </div>
                picture
            </div>
            <div className="justify-start pt-[1.5em] font-bold text-[1.5em]">{item.name}</div>
            <div className="text-[1.125em] flex flex-wrap gap-[0.5em] pt-[0.5em] pb-[0.5em]">
                <ItemTag name={item.size} color={sizeColors[item.size]} />
                <ItemTag name={item.category} color={categoryColors(item.category)} />
                <ItemTag name={`${item.quantity}`} color={quantityColors(item.quantity)} />
            </div>
            <div className=" text-[1.25em] text-gray-400">{item.dateAdded.toDate().toLocaleDateString()}</div>
        </div>
    )

}
