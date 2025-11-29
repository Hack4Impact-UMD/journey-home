// components/GalleryItem.tsx
"use client";

import type { InventoryRecord } from "@/types/inventory";
import { Badge } from "./Badge";

type GalleryItemProps = {
  item: InventoryRecord;
  onDeleted?: (id: string) => void;
  onClick?: () => void;
};


export default function GalleryItem({ item, onDeleted, onClick }: GalleryItemProps) {
  const firstPhoto = item.photos?.[0];
  const firstPhotoUrl =
    typeof firstPhoto === "string"
      ? firstPhoto
      : firstPhoto?.url ?? null;
  return (
    <div onClick={onClick} className="group w-full max-w-md aspect-[15/21] flex flex-col justify-start p-[1.25em] bg-white border-1 relative border-gray-200 shadow-lg rounded-[.75em] cursor-pointer">
      <div className="relative w-full aspect-square bg-white border border-grey rounded-[.75em] overflow-hidden">
        {firstPhotoUrl ? (
          <img
            src={firstPhotoUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}

        {/* top-right icons */}
        <div className="w-[1.5em] aspect-square bg-white border border-black absolute top-[0.75em] right-[0.75em] flex items-center justify-center pt-[1em]">
        </div>
        
      </div>
      <div className="justify-start pt-[1.5em] font-bold text-[1.5em]">
        {item.name}
      </div>
      <div className="text-[1.125em] flex flex-wrap gap-[0.5em] pt-[0.5em] pb-[0.5em]">
        <Badge text={item.category} color="blue" />
        <Badge
            text={item.size}
            color={
                item.size == "Large"
                ? "pink"
                : item.size == "Medium"
                ? "purple"
                : "yellow"
            }
        />
        <Badge
            text={item.quantity.toString()}
            color="orange"
        />
      </div>
      <div className="text-[1.25em] text-gray-400">
        {item.dateAdded.toDate().toLocaleDateString()}
      </div>
    </div>
  );
}
