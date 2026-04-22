"use client";

import { useInventoryCategories } from "@/lib/queries/inventory";
import ItemSearch from "./ItemSearch";

type Props = {
  onAddItem: (item: { name: string; qty: number }) => void;
  onClose: () => void;
};

export default function CheckInOutFlow({ onAddItem, onClose }: Props) {
  const { inventoryCategories, isLoading, isError } =
    useInventoryCategories();

  return (
    <div className="relative z-50">
        <ItemSearch
        categories={inventoryCategories}
        isLoading={isLoading}
        isError={isError}
        onAdd={onAddItem}
        onClose={onClose}
        />
    </div>
  );
}