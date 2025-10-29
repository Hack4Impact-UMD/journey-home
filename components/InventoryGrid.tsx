import React from "react";

interface InventoryGridProps {
  items: any[];
  onItemClick: (item: any) => void;
}

export default function InventoryGrid({ items, onItemClick }: InventoryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map(item => (
        <div key={item.id} onClick={() => onItemClick(item)} className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-lg transition-shadow cursor-pointer">
          <div className="relative">
            <input type="checkbox" className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()} />
            <div className="w-full h-48 bg-gray-200 rounded mb-4" />
          </div>
          <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
          <div className="flex gap-2 mb-2 flex-wrap">
            <span className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">{item.size}</span>
            <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">{item.category}</span>
            <span className="px-2 py-1 rounded text-xs bg-amber-100 text-amber-800 font-semibold">{item.quantity}</span>
          </div>
          <p className="text-sm text-gray-600">{item.date}</p>
        </div>
      ))}
    </div>
  );
}