// components/GalleryItem.tsx
"use client";

import type { InventoryRecord } from "@/types/inventory";
import ItemTag, {
  categoryColors,
  quantityColors,
  sizeColors,
} from "./ItemTag";
import { TrashIcon } from "./icons/TrashIcon";

type GalleryItemProps = {
  item: InventoryRecord;
  onDeleted?: (id: string) => void;
};

export default function GalleryItem({ item, onDeleted }: GalleryItemProps) {
  return (
    <div className="group w-full max-w-md aspect-[15/21] flex flex-col justify-start p-[1.25em] bg-white border-1 relative border-gray-200 shadow-lg rounded-[.75em] cursor-pointer">
      <div className="relative w-full aspect-square bg-white border border-grey rounded-[.75em]">
        {/* top-right icons */}
        <div className="absolute top-[0.5em] right-[0.5em] flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* you can add an Edit icon/link here too if you want */}
          <TrashIcon
            id={item.id}
            onDeleted={onDeleted}
            className="w-[1.25em] h-[1.25em]"
          />
        </div>
        
      </div>
      <div className="justify-start pt-[1.5em] font-bold text-[1.5em]">
        {item.name}
      </div>
      <div className="text-[1.125em] flex flex-wrap gap-[0.5em] pt-[0.5em] pb-[0.5em]">
        <ItemTag name={item.size} color={sizeColors[item.size]} />
        <ItemTag name={item.category} color={categoryColors(item.category)} />
        <ItemTag
          name={`${item.quantity}`}
          color={quantityColors(item.quantity)}
        />
      </div>
      <div className="text-[1.25em] text-gray-400">
        {item.dateAdded.toDate().toLocaleDateString()}
      </div>
    </div>
  );
}
