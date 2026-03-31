"use client";

import { InventoryCategory } from "@/types/inventory";
import { ItemDial } from "./ItemDial";

export function CategoryDialsGrid({ categories }: { categories: InventoryCategory[] }) {
    if (categories.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center text-sm text-[#BFBFBF]">
                No categories found.
            </div>
        );
    }

    return (
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
            {categories.map((category) => (
                <ItemDial key={category.id} category={category} />
            ))}
        </div>
    );
}