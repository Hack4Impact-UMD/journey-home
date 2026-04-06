"use client";

import { useInventoryCategories } from "@/lib/queries/inventory";
import ItemSearcm from "./ItemSearcm";

type Props = {
  onAddItem: (item: { name: string; qty: number }) => void;
  onClose: () => void;
};

export default function CheckInOutFlow({ onAddItem, onClose }: Props) {
  const { inventoryCategories, isLoading, isError } =
    useInventoryCategories();

  return (
    <ItemSearcm
      categories={inventoryCategories}
      isLoading={isLoading}
      isError={isError}
      onAdd={onAddItem}
      onClose={onClose}
    />
  );
}