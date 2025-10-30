"use client";

import CategoryFilter from "./CategoryFilter";
import SizeFilter from "./SizeFilter";
import SortPreset, { PresetKey } from "./SortPreset";

type Filters = {
  category: string;
  size: string;
  inStockOnly: boolean;
};

const DEFAULT_FILTERS: Filters = { category: "Any", size: "Any", inStockOnly: false };

export default function FilterBar({
  filters,
  onFiltersChange,
  sortBy,
  onSortChange,
  categories,
  rightExtra,
}: {
  filters?: Filters;
  onFiltersChange?: (f: Filters) => void; 
  sortBy: "Highest stock" | "Lowest stock" | "Newest" | "Oldest" | "A–Z" | "Z–A";
  onSortChange: (v: "Highest stock" | "Lowest stock" | "Newest" | "Oldest" | "A–Z" | "Z–A") => void;
  categories?: string[];
  rightExtra?: React.ReactNode;
}) {
  const f = filters ?? DEFAULT_FILTERS;
  const set = (next: Partial<Filters>) =>
    onFiltersChange?.({ ...f, ...next });

  const chipKey: PresetKey =
    sortBy === "Newest" || sortBy === "Oldest" ? "Date" : "Quantity";
  const chipAsc =
    sortBy === "Lowest stock" || sortBy === "Oldest" || sortBy === "A–Z";

  function handleChipChange(key: PresetKey, asc: boolean) {
    if (key === "Quantity") onSortChange(asc ? "Lowest stock" : "Highest stock");
    else onSortChange(asc ? "Oldest" : "Newest");
  }

  return (
    <div className="flex w-full items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <CategoryFilter
          value={f.category}
          onChange={(v) => set({ category: v })}
          categories={categories}
        />
        <SizeFilter
          value={f.size}
          onChange={(v) => set({ size: v })}
        />
        <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300"
            checked={f.inStockOnly}
            onChange={(e) => set({ inStockOnly: e.target.checked })}
          />
          In stock only
        </label>
        <SortPreset sortBy={chipKey} ascending={chipAsc} onChange={handleChipChange} />
      </div>
      {rightExtra && <div className="ml-auto">{rightExtra}</div>}
    </div>
  );
}
