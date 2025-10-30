"use client";

import GalleryItem from "@/components/GalleryItem";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
import type { SortKey } from "@/components/SortMenu";

import { InventoryRecord } from "@/types/inventory";
import { search as searchInventory } from "@/lib/services/inventory"; // <- backend search
import { Timestamp } from "firebase/firestore";
import { useEffect, useMemo, useRef, useState } from "react";

/** Seed items for an initial skeleton before Firestore returns. */
const ITEMS: InventoryRecord[] = [
  { id: "1", name: "item1", photos: [], category: "Couches", notes: "N/A", quantity: 1, size: "Large",  dateAdded: Timestamp.fromDate(new Date("2025-10-27T16:00:00Z")), donorEmail: null},
  { id: "2", name: "item2", photos: [], category: "Chairs",  notes: "N/A", quantity: 1, size: "Medium", dateAdded: Timestamp.fromDate(new Date("2025-10-28T16:00:00Z")), donorEmail: null},
  { id: "3", name: "item3", photos: [], category: "Tables",  notes: "N/A", quantity: 1, size: "Small",  dateAdded: Timestamp.fromDate(new Date("2025-10-29T16:00:00Z")), donorEmail: null},
  { id: "4", name: "item4", photos: [], category: "Tables",  notes: "N/A", quantity: 1, size: "Small",  dateAdded: Timestamp.fromDate(new Date("2025-10-30T16:00:00Z")), donorEmail: null},
  { id: "5", name: "item5", photos: [], category: "Tables",  notes: "N/A", quantity: 1, size: "Small",  dateAdded: Timestamp.fromDate(new Date("2025-10-31T16:00:00Z")), donorEmail: null},
];

/** Map UI sort labels → backend params.sortBy / params.ascending */
function sortKeyToParams(sortKey: SortKey): { sortBy: "Date" | "Quantity" | "Name"; ascending: boolean } {
  switch (sortKey) {
    case "Highest stock": return { sortBy: "Quantity", ascending: false };
    case "Lowest stock":  return { sortBy: "Quantity", ascending: true  };
    case "Newest":        return { sortBy: "Date",     ascending: false };
    case "Oldest":        return { sortBy: "Date",     ascending: true  };
    case "A–Z":           return { sortBy: "Name",     ascending: true  };
    case "Z–A":           return { sortBy: "Name",     ascending: false };
    default:              return { sortBy: "Quantity", ascending: false };
  }
}

export default function WarehousePage() {
  // Keep search results (as before) so SearchBar remains unchanged.
  const [results, setResults] = useState<InventoryRecord[] | null>(null);

  // Track current filters/sort for backend search
  const [filters, setFilters] = useState({ category: "Any", size: "Any", inStockOnly: false });
  const [sortBy, setSortBy] = useState<SortKey>("Highest stock");

  // Remember the last query string so we can re-run backend search when filters/sort change.
  const [query, setQuery] = useState<string>(""); 
  const pendingRef = useRef<number | null>(null);        
  const [loading, setLoading] = useState(false);

  // categories list for the Category dropdown (from currently shown items or seed)
  const categories = useMemo(() => {
    const source = results ?? ITEMS;
    return Array.from(new Set(source.map(i => i.category))).sort();
  }, [results]);

  // Helper to call backend given the current query + filters + sort
  async function runBackendSearch(q: string) {
    setLoading(true);
    try {
      const mapped = sortKeyToParams(sortBy);
      const params = {
        categories: filters.category === "Any" ? [] : [filters.category],
        sizes: filters.size === "Any" ? [] : [filters.size],
        sortBy: mapped.sortBy,
        ascending: mapped.ascending,
        inStockOnly: filters.inStockOnly, // supported in the slight service tweak I shared
      } as const;

      const data = await searchInventory(q, params);
      setResults(data); // keep same state the SearchBar already uses
    } finally {
      setLoading(false);
    }
  }

  // Called when SearchBar performs a search.
  const handleQueryChange = (q: string) => {
    setQuery(q);
    // immediately run backend with current filters/sort so the list reflects them
    runBackendSearch(q);
  };

  // Re-run backend search when filters or sort change (debounced), using the last query.
  useEffect(() => {
    if (pendingRef.current) window.clearTimeout(pendingRef.current);
    pendingRef.current = window.setTimeout(() => {
      runBackendSearch(query);
    }, 200);
    return () => {
      if (pendingRef.current) window.clearTimeout(pendingRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortBy]);

  // Items to render (use seed before the first fetch)
  const itemsToDisplay = results ?? ITEMS;

  return (
    <div className="p-6 flex flex-1 flex-col h-[calc(80vh-5rem)] min-h-0 overflow-hidden">
      {/* Top bar: Search left, Filters right */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex-1 max-w-lg">
          {/* Keep existing prop setResults. Add optional onQueryChange so we know the string. */}
          <SearchBar setResults={setResults} onQueryChange={handleQueryChange} />
        </div>
        <div className="flex items-center gap-3">
          <FilterBar
            filters={filters}
            onFiltersChange={setFilters}
            sortBy={sortBy}
            onSortChange={setSortBy}
            categories={categories}
          />
        </div>
      </div>

      {loading && <div className="text-sm text-gray-500 mb-2">Loading…</div>}

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="grid grid-cols-4 gap-6">
          {itemsToDisplay.map((item) => (
            <GalleryItem key={item.id} item={item} />
          ))}
          {!itemsToDisplay.length && !loading && (
            <div className="col-span-4 text-sm text-gray-500">No items match your filters.</div>
          )}
        </div>
      </div>
    </div>
  );
}
