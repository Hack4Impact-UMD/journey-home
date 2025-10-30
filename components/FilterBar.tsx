"use client";

import CategoryFilter from "./CategoryFilter";
import SizeFilter from "./SizeFilter";
import SortMenu, { SortKey } from "./SortMenu";

export type InventoryFilters = {
  category: string;
  size: string;
  inStockOnly: boolean;
};

type Props = {
  filters: InventoryFilters;
  onFiltersChange: (f: InventoryFilters) => void;
  sortBy: SortKey;
  onSortChange: (s: SortKey) => void;
  categories?: string[];
};

export default function FilterBar({
  filters, onFiltersChange, sortBy, onSortChange, categories
}: Props) {
  return (
    <div className="flex items-center gap-3">
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
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/40"
          checked={filters.inStockOnly}
          onChange={(e) => onFiltersChange({ ...filters, inStockOnly: e.target.checked })}
        />
        <span className="text-sm text-gray-700">In stock only</span>
      </label>
      <SortMenu value={sortBy} onChange={onSortChange} />
    </div>
  );
}
