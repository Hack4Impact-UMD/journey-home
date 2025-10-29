import React from "react";

interface InventoryFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  size: string;
  setSize: (val: string) => void;
  onSortQnt: () => void;
  onSortDate: () => void;
  viewMode: "table" | "grid";
  setViewMode: (mode: "table" | "grid") => void;
  selectedDonor?: string | null;
  onBack?: () => void;
}

export default function InventoryFilters({
  search,
  setSearch,
  category,
  setCategory,
  size,
  setSize,
  onSortQnt,
  onSortDate,
  viewMode,
  setViewMode,
  selectedDonor,
  onBack,
}: InventoryFiltersProps) {
  return (
    <div className="mb-6 flex items-center gap-3 flex-wrap">
      {selectedDonor && onBack && (
        <>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 font-medium"
          >
            Back
          </button>
          <h2 className="text-xl font-bold text-gray-900">{selectedDonor}</h2>
        </>
      )}

      <div className="relative flex-1 max-w-xs">
        <input
          type="search"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm w-full"
        />
        <svg className="absolute left-3 top-2.5 text-gray-400" width="14" height="14" viewBox="0 0 20 20">
          <path d="M12.9 14.32a8 8 0 111.41-1.41l4.38 4.38-1.42 1.42-4.37-4.39zM8 14a6 6 0 100-12 6 6 0 000 12z" fill="currentColor"/>
        </svg>
      </div>

      <select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm">
        <option value="Any">Categories</option>
        <option value="Sofa">Sofa</option>
        <option value="Chair">Chair</option>
        <option value="Coffee table">Coffee table</option>
        <option value="Kitchen appliance">Kitchen appliance</option>
      </select>

      <select value={size} onChange={(e) => setSize(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm">
        <option value="Any">Size</option>
        <option value="Small">Small</option>
        <option value="Medium">Medium</option>
        <option value="Large">Large</option>
      </select>

      <button onClick={onSortQnt} className="border border-gray-300 rounded-md px-3 py-2 text-sm hover:bg-gray-50">
        Qnt ↕
      </button>

      <button onClick={onSortDate} className="border border-gray-300 rounded-md px-3 py-2 text-sm hover:bg-gray-50">
        Date ↕
      </button>

      <div className="ml-auto flex gap-2">
        <button onClick={() => setViewMode("table")} className={`p-2 rounded ${viewMode === "table" ? "bg-gray-200" : ""}`}>
          ☰
        </button>
        <button onClick={() => setViewMode("grid")} className={`p-2 rounded ${viewMode === "grid" ? "bg-gray-200" : ""}`}>
          ⊞
        </button>
      </div>
    </div>
  );
}