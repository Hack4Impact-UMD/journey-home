"use client";

import { useState } from "react";
import BoxIcon from "../icons/BoxIcon";
import { SearchIcon } from "../icons/SearchIcon";
import { Badge } from "../../components/inventory/Badge";
import { InventoryCategory } from "@/types/inventory";

type Props = {
  categories: InventoryCategory[];
  isLoading: boolean;
  isError: boolean;
  onAdd: (item: { name: string; qty: number }) => void;
  onClose: () => void;
};

export default function ItemSearcm({
  categories,
  isLoading,
  isError,
  onAdd,
  onClose,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("");

  const filteredItems =
    searchQuery.trim() && !selectedItem
      ? categories.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];

  const handleAdd = () => {
    if (!selectedItem || !quantity) return;

    onAdd({
      name: selectedItem,
      qty: Number(quantity),
    });

    // reset ONLY local state
    setSelectedItem(null);
    setQuantity("");
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col bg-white rounded-2xl p-6 w-full h-[80%] overflow-y-auto relative shadow-xl">

      {!selectedItem && (
        <>
          <div className="flex items-center border-b px-4 py-3 gap-2">
            <SearchIcon />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search inventory"
              className="flex-1 outline-none text-sm"
            />
          </div>

          {isLoading && <p className="px-4 py-2">Loading...</p>}
          {isError && <p className="px-4 py-2 text-red-500">Error</p>}

          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item.name)}
              className="px-4 py-3 border-b cursor-pointer hover:bg-gray-50"
            >
              {item.name}
            </div>
          ))}
        </>
      )}

      {selectedItem && (
        <>
          <div className="flex items-center gap-2 border-b px-4 py-3">
            <button onClick={() => setSelectedItem(null)}>←</button>
            <Badge text={selectedItem} color="blue"/>
          </div>

          <div className="flex items-center gap-3 px-4 py-3 border-b">
            <BoxIcon />
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Quantity"
              className="w-full outline-none"
            />
          </div>

          {quantity && (
            <div className="px-4 pt-4">
              <button
                onClick={handleAdd}
                className="w-full bg-[#02AFC7] text-white py-3 rounded-full"
              >
                Add Item
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            className="mt-3 text-sm text-gray-500"
          >
            Close
          </button>
        </>
      )}
    </div>
  );
}