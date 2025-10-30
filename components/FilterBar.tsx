"use client";

import CategoryFilter from "./CategoryFilter";
import SizeFilter from "./SizeFilter";
import SortPreset, { PresetKey } from "./SortPreset";

type Filters = {
  category: string; // "Any" or value
  size: string;     // "Any" | "Small" | "Medium" | "Large"
  inStockOnly: boolean;
};

export default function FilterBar({
  filters,
  onFiltersChange,
  // keep your existing SortMenu prop names by mapping to chips
  sortBy,
  onSortChange,
  categories,
}: {
  filters: Filters;
  onFiltersChange: (f: Filters) => void;
  sortBy: "Highest stock" | "Lowest stock" | "Newest" | "Oldest" | "A–Z" | "Z–A";
  onSortChange: (v: typeof sortBy) => void;
  categories?: string[];
}) {
  // map your existing SortMenu values to chip state
  const chipKey: PresetKey =
    sortBy === "Newest" || sortBy === "Oldest" ? "Date" : "Quantity";
  const chipAsc =
    sortBy === "Lowest stock" || sortBy === "Oldest" || sortBy === "A–Z";

  function handleChipChange(key: PresetKey, asc: boolean) {
    if (key === "Quantity") onSortChange(asc ? "Lowest stock" : "Highest stock");
    else onSortChange(asc ? "Oldest" : "Newest");
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <CategoryFilter
        value={filters.category}
        onChange={(v) => onFiltersChange({ ...filters, category: v })}
        categories={categories}
      />
      <SizeFilter
        value={filters.size}
        onChange={(v) => onFiltersChange({ ...filters, size: v })}
      />
      <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300"
          checked={filters.inStockOnly}
          onChange={(e) => onFiltersChange({ ...filters, inStockOnly: e.target.checked })}
        />
        In stock only
      </label>
      <SortPreset sortBy={chipKey} ascending={chipAsc} onChange={handleChipChange} />
    </div>
  );
}
