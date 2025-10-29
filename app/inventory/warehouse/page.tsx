"use client";

import GalleryItem from "@/components/GalleryItem";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
import type { SortKey } from "@/components/SortMenu";
import { applyFiltersAndSort, uniqueCategories } from "@/lib/inventoryFilters";
import { InventoryRecord } from "@/types/inventory";
import { Timestamp } from "firebase/firestore";
import { useMemo, useState } from "react";

const ITEMS: InventoryRecord[] = [
  { id: "1", name: "item1", photos: [], category: "Couches", notes: "N/A", quantity: 1, size: "Large",  dateAdded: Timestamp.fromDate(new Date("2025-10-27T16:00:00Z")), donorEmail: null},
  { id: "2", name: "item2", photos: [], category: "Chairs",  notes: "N/A", quantity: 1, size: "Medium", dateAdded: Timestamp.fromDate(new Date("2025-10-28T16:00:00Z")), donorEmail: null},
  { id: "3", name: "item3", photos: [], category: "Tables",  notes: "N/A", quantity: 1, size: "Small",  dateAdded: Timestamp.fromDate(new Date("2025-10-29T16:00:00Z")), donorEmail: null},
  { id: "4", name: "item4", photos: [], category: "Tables",  notes: "N/A", quantity: 1, size: "Small",  dateAdded: Timestamp.fromDate(new Date("2025-10-30T16:00:00Z")), donorEmail: null},
  { id: "5", name: "item5", photos: [], category: "Tables",  notes: "N/A", quantity: 1, size: "Small",  dateAdded: Timestamp.fromDate(new Date("2025-10-31T16:00:00Z")), donorEmail: null},
];

export default function WarehousePage() {
  // search results from SearchBar (null = show all)
  const [results, setResults] = useState<InventoryRecord[] | null>(null);

  // filters + sort
  const [filters, setFilters] = useState({ category: "Any", size: "Any", inStockOnly: false });
  const [sortBy, setSortBy] = useState<SortKey>("Highest stock");

  const base = results === null ? ITEMS : results;
  const categories = useMemo(() => uniqueCategories(ITEMS), []);
  const itemsToDisplay = useMemo(
    () => applyFiltersAndSort(base, filters, sortBy),
    [base, filters, sortBy]
  );

  return (
    <div className="p-6 flex flex-1 flex-col h-[calc(80vh-5rem)] min-h-0 overflow-hidden">
      <div className="mb-6 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <SearchBar setResults={setResults} />
        </div>
        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
          sortBy={sortBy}
          onSortChange={setSortBy}
          categories={categories}
        />
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="grid grid-cols-4 gap-6">
          {itemsToDisplay.map((item) => (
            <GalleryItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
