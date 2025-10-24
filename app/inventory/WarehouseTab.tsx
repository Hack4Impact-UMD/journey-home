"use client";
import React, { useState, useMemo } from "react";
import FilterBar from "@/components/FilterBar"; 

type Item = {
  id: string;
  name: string;
  category: "Couches" | "Chairs" | "Tables" | string;
  quantity: number;
  addedAt: string;
  photoUrl?: string;
};

const ITEMS: Item[] = [
  { id: "1", name: "Leather Sectional", category: "Couches", quantity: 5, addedAt: "9/22" },
  { id: "2", name: "Velvet Loveseat", category: "Couches", quantity: 3, addedAt: "9/20" },
  { id: "3", name: "Dining Table", category: "Tables", quantity: 2, addedAt: "9/19" },
  { id: "4", name: "Recliner", category: "Chairs", quantity: 4, addedAt: "9/16" },
  { id: "5", name: "Coffee Table", category: "Tables", quantity: 1, addedAt: "9/10" },
  { id: "6", name: "Armchair", category: "Chairs", quantity: 6, addedAt: "9/08" },
];

function PhotoPlaceholder() {
  return <div className="h-14 w-14 rounded-md bg-gray-200" />;
}

function InventoryTable({ items }: { items: Item[] }) {
  return (
    <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr className="text-sm text-gray-600">
            <th className="px-6 py-3 text-left font-medium">Name</th>
            <th className="px-6 py-3 text-left font-medium">Category</th>
            <th className="px-6 py-3 text-left font-medium">Size</th>
            <th className="px-6 py-3 text-left font-medium">Quantity</th>
            <th className="px-6 py-3 text-left font-medium">Date</th>
            <th className="px-6 py-3 text-left font-medium">View</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-6 text-center text-gray-500">
                No items found.
              </td>
            </tr>
          ) : (
            items.map((it) => (
              <tr key={it.id} className="border-b border-gray-100 last:border-0 text-sm">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <PhotoPlaceholder />
                    <span>{it.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                    {it.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">
                    Medium
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">
                    {it.quantity}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{it.addedAt}</td>
                <td className="px-6 py-4">
                  <button className="px-3 py-1 bg-cyan-500 text-white text-xs rounded hover:bg-cyan-600">
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function WarehouseTab() {
  const [category, setCategory] = useState("Any");
  const [search, setSearch] = useState("");
  const [sortDesc, setSortDesc] = useState(true);

  const filteredItems = useMemo(() => {
    let filtered = ITEMS;
    if (category !== "Any") filtered = filtered.filter((i) => i.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          i.addedAt.toLowerCase().includes(q)
      );
    }
    filtered = filtered.sort((a, b) =>
      sortDesc ? b.quantity - a.quantity : a.quantity - b.quantity
    );
    return filtered;
  }, [category, search, sortDesc]);

  return (
    <>
      <FilterBar
        category={category}
        setCategory={setCategory}
        search={search}
        setSearch={setSearch}
        sortDesc={sortDesc}
        toggleSort={() => setSortDesc((v) => !v)}
      />
      <InventoryTable items={filteredItems} />
    </>
  );
}
