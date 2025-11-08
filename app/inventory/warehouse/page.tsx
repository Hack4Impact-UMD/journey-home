"use client";

import GalleryItem from "@/components/GalleryItem";
import SearchBar from "@/components/SearchBar";
import CategorySelect from "@/components/CategorySelect";
import SizeSelect from "@/components/SizeSelect";
import SortToggle, { SortKeyToggle } from "@/components/SortToggle";
import NewItemButton from "@/components/NewItemButton";

import type { InventoryRecord, SearchParams } from "@/types/inventory";
import { Timestamp } from "firebase/firestore";
import { useCallback, useMemo, useState } from "react";
import { search as searchBackend } from "@/lib/services/inventory";

const ITEMS: InventoryRecord[] = [
  { id: "1", name: "item1", photos: [], category: "Couches", notes: "N/A", quantity: 2, size: "Large",  dateAdded: Timestamp.fromDate(new Date("2025-10-27T16:00:00Z")), donorEmail: null },
  { id: "2", name: "item2", photos: [], category: "Chairs",  notes: "N/A", quantity: 1, size: "Medium", dateAdded: Timestamp.fromDate(new Date("2025-10-28T16:00:00Z")), donorEmail: null },
  { id: "3", name: "item3", photos: [], category: "Tables",  notes: "N/A", quantity: 3, size: "Small",  dateAdded: Timestamp.fromDate(new Date("2025-10-29T16:00:00Z")), donorEmail: null },
  { id: "4", name: "item4", photos: [], category: "Tables",  notes: "N/A", quantity: 1, size: "Small",  dateAdded: Timestamp.fromDate(new Date("2025-10-30T16:00:00Z")), donorEmail: null },
  { id: "5", name: "item5", photos: [], category: "Tables",  notes: "N/A", quantity: 5, size: "Small",  dateAdded: Timestamp.fromDate(new Date("2025-10-31T16:00:00Z")), donorEmail: null },
];

export default function WarehousePage() {
  const [results, setResults] = useState<InventoryRecord[] | null>(null);
  const [category, setCategory] = useState("Any");
  const [size, setSize] = useState("Any");
  const [sortKey, setSortKey] = useState<SortKeyToggle>("Quantity");
  const [ascending, setAscending] = useState(false);

  const params: SearchParams = useMemo(
    () => ({
      categories: category === "Any" ? [] : [category],
      sizes: size === "Any" ? [] : [size],
      sortBy: sortKey === "Quantity" ? "Quantity" : "Date",
      ascending,
    }),
    [category, size, sortKey, ascending]
  );

  const localFilterAndSort = useCallback((q: string, p: SearchParams) => {
    const query = q.toLowerCase().trim();
    return ITEMS.filter((r) => {
      if (p.categories.length && !p.categories.includes(r.category)) return false;
      if (p.sizes.length && !p.sizes.includes(r.size)) return false;
      const keys = `${r.name} ${r.category} ${r.notes} ${r.size}`.toLowerCase();
      return keys.includes(query);
    }).sort((a, b) => {
      let d = 0;
      if (p.sortBy === "Date") d = a.dateAdded.seconds - b.dateAdded.seconds;
      else if (p.sortBy === "Quantity") d = a.quantity - b.quantity;
      else d = a.name.localeCompare(b.name);
      return p.ascending ? d : -d;
    });
  }, []);

  const onSearch = useCallback(
    async (q: string) => {
      try {
        const data = await searchBackend(q, params);
        setResults(data);
      } catch {
        setResults(localFilterAndSort(q, params)); // fallback to local data
      }
    },
    [params, localFilterAndSort]
  );

  const itemsToDisplay = results ?? ITEMS;

  return (
    <div className="p-6 flex flex-wrap flex-1 flex-col h-[calc(80vh-5rem)] min-h-0 overflow-hidden">
      {/* toolbar: tight alignment */}
      <div className="mb-6 flex gap-2 flex-row items-center justify-start">
        <div>
          <SearchBar onSearch={onSearch} />
        </div>
        <CategorySelect value={category} onChange={setCategory} />
        <SizeSelect value={size} onChange={setSize} />
        <SortToggle
          sortBy={sortKey}
          ascending={ascending}
          onChange={(k, asc) => { setSortKey(k); setAscending(asc); }}
        />
        {/* New Item button pinned to the right */}
        
        <NewItemButton
          onCreated={(record) => {
            setResults((prev) => [record, ...(prev ?? ITEMS)]);
          }}
        />

      </div>

      <div className="flex-1 flex-wrap overflow-y-auto min-h-0">
        <div className="grid grid-cols-4 gap-6">
          {itemsToDisplay.map((item) => (
            <GalleryItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
