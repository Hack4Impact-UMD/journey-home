"use client";

import CategoryFilter from "./CategoryFilter";
import SizeFilter from "./SizeFilter";
import SortMenu, { SortKey } from "./SortMenu";

export type InventoryFilters = {
  category: string; // e.g., "Any" or "Couches"
  size: string;     // "Any" | "Small" | "Medium" | "Large"
  inStockOnly: boolean;
};

type Props = {
  filters: InventoryFilters;
  onFiltersChange: (f: InventoryFilters) => void;
  sortBy: SortKey;
  onSortChange: (s: SortKey) => void;
  categories?: string[]; // optional dynamic categories
  rightExtra?: React.ReactNode; // for future buttons, etc.
};

export default function FilterBar({
  filters, onFiltersChange, sortBy, onSortChange, categories, rightExtra
}: Props) {
  return (
    <div className="flex w-full items-center justify-between gap-3">
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
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300"
            checked={filters.inStockOnly}
            onChange={(e) => onFiltersChange({ ...filters, inStockOnly: e.target.checked })}
          />
          <span className="text-sm text-gray-700">In stock only</span>
        </label>
        <SortMenu value={sortBy} onChange={onSortChange} />
      </div>
      {rightExtra}
    </div>
  );
}
