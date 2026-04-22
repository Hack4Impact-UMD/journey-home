"use client";

import { useState } from "react";
import BoxIcon from "../icons/BoxIcon";
import { SearchIcon } from "../icons/SearchIcon";
import { Badge } from "../inventory/Badge";
import { InventoryCategory } from "@/types/inventory";

type Props = {
  categories: InventoryCategory[];
  isLoading: boolean;
  isError: boolean;
  onAdd: (item: { name: string; qty: number }) => void;
  onClose: () => void;
};

export default function ItemSearch({
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
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty <= 0) return;

    onAdd({
      name: selectedItem,
      qty: Number(quantity),
    });

    setSelectedItem(null);
    setQuantity("");
    setSearchQuery("");
  };

  return (
    <div className="fixed inset-0 flex items-end justify-center" onClick={onClose}>
    <div className="flex flex-col bg-white rounded-t-2xl p-6 w-full h-[80%]  relative shadow-[0_-4px_6px_rgba(0,0,0,0.1)]"  onClick={(e) => e.stopPropagation()}>

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
            min={1}
            step={1}
         />
    </div>
    {quantity && (
            <div className="px-4 pt-4">
              <button
                onClick={handleAdd}
                className="w-full h-[3em] bg-[#02AFC7] text-white "
              >
                Add Item
              </button>
              {/*there's not really a button functionality on the figma but i didn't know how to do it otherwise so i added it here
              feel free to remove!  */}
            </div>
          )}
          </>
          )}
    </div>
    </div>
  );
}