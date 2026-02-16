"use client";

import { useState } from "react";

interface Item {
  label: string;
  description?: string;
  quantity: number;
}

interface BoxProps {
  categoryName: string;
  items: Item[];
  onChange: (items: Item[]) => void;
}

export default function CategoryBox({ categoryName, items, onChange }: BoxProps) {
  const [itemList, setItemList] = useState<Item[]>(items);

  const handleQuantityChange = (index: number, value: string) => {
    const numericValue = value === "" ? 0 : Math.max(0, Number(value));
    const updated = [...itemList];
    updated[index] = { ...updated[index], quantity: numericValue };
    setItemList(updated);
    if (onChange) onChange(updated);
  };

  return (
    <div className="border border-[#D9D9D9] rounded-md overflow-hidden w-full max-w-md">
      <div className="bg-[#D9D9D9] px-4 py-2 font-semibold">{categoryName}</div>

      <div className="grid grid-cols-2 px-4 py-2 border-b border-[#D9D9D9] font-bold bg-white">
        <div>Item Type</div>
        <div className="text-right">Quantity</div>
      </div>

      <div className="bg-white">
        {itemList.map((item, index) => (
          <div
            key={item.label}
            className="grid grid-cols-2 px-4 py-2 border-b border-[#D9D9D9] last:border-b-0"
          >
            <div>
              <div>{item.label}</div>
              {item.description && (
                <div className="text-[#BBBDBE] text-sm">{item.description}</div>
              )}
            </div>
            <div className="text-right">
              <input
                type="number"
                min={0}
                value={item.quantity}
                onChange={(e) => handleQuantityChange(index, e.target.value)}
                className="w-16 border border-[#D9D9D9] rounded px-2 py-1 text-right"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
