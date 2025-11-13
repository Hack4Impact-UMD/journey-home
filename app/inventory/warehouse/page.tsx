// app/inventory/warehouse/page.tsx
"use client";

import GalleryItem from "@/components/GalleryItem";
import SearchBar from "@/components/SearchBar";
import CategorySelect from "@/components/CategorySelect";
import SizeSelect from "@/components/SizeSelect";
import SortToggle, { SortKeyToggle } from "@/components/SortToggle";
import AddItem from "@/components/AddItem";
import Link from "next/link";
import type { InventoryRecord, SearchParams } from "@/types/inventory";
import { Timestamp } from "firebase/firestore";
import { useCallback, useMemo, useState } from "react";
import { search as searchBackend } from "@/lib/services/inventory";
import EditItem from "@/components/EditItem";
import NewItemButton from "@/components/NewItemButton";
import { DonationItem, DonationRequest } from "@/types/donations";
import { TableView } from "@/components/TableView";
import { InventoryItemView } from "@/components/InventoryItemView";

const ITEMS: InventoryRecord[] = [
  {
    id: "1",
    name: "item1",
    photos: [],
    category: "Couches",
    notes: "N/A",
    quantity: 2,
    size: "Large",
    dateAdded: Timestamp.fromDate(new Date("2025-10-27T16:00:00Z")),
    donorEmail: null,
  },
  {
    id: "2",
    name: "item2",
    photos: [],
    category: "Chairs",
    notes: "N/A",
    quantity: 1,
    size: "Medium",
    dateAdded: Timestamp.fromDate(new Date("2025-10-28T16:00:00Z")),
    donorEmail: null,
  },
  {
    id: "3",
    name: "item3",
    photos: [],
    category: "Tables",
    notes: "N/A",
    quantity: 3,
    size: "Small",
    dateAdded: Timestamp.fromDate(new Date("2025-10-29T16:00:00Z")),
    donorEmail: null,
  },
  {
    id: "4",
    name: "item4",
    photos: [],
    category: "Tables",
    notes: "N/A",
    quantity: 1,
    size: "Small",
    dateAdded: Timestamp.fromDate(new Date("2025-10-30T16:00:00Z")),
    donorEmail: null,
  },
  {
    id: "5",
    name: "item5",
    photos: [],
    category: "Tables",
    notes: "N/A",
    quantity: 5,
    size: "Small",
    dateAdded: Timestamp.fromDate(new Date("2025-10-31T16:00:00Z")),
    donorEmail: null,
  },
];

const MOCK_DONATION_REQUEST: DonationRequest = {
  id: "1",
  donor: {
    firstName: "TEST",
    lastName: "TEST",
    email: "TEST@example.com",
    phoneNumber: "123-456-7890",
    address: {
      streetAddress: "123 Main St",
      city: "Anytown",
      state: "NY",
      zipCode: "12345",
    },
  },
  items: [],
  firstTimeDonor: false,
  howDidYouHear: "",
  canDropOff: false,
  notes: "",
  date: Timestamp.now(),
};

const MOCK_DONATION_ITEM = (record: InventoryRecord): DonationItem => ({
  item: record,
  status: "Not Reviewed",
});

export default function WarehousePage() {
  const [results, setResults] = useState<InventoryRecord[] | null>(null);
  const [category, setCategory] = useState("Any");
  const [size, setSize] = useState("Any");
  const [sortKey, setSortKey] = useState<SortKeyToggle>("Quantity");
  const [ascending, setAscending] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DonationItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"gallery" | "table">("gallery");
  const [selectedDR, setSelectedDR] = useState<DonationRequest | null>(null);
  const [selectedRecord, setSelectedRecord] =
    useState<InventoryRecord | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

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
      if (p.categories.length && !p.categories.includes(r.category))
        return false;
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
        setResults(localFilterAndSort(q, params));
      }
    },
    [params, localFilterAndSort]
  );

  const itemsToDisplay = results ?? ITEMS;

  return (
    <div className="p-6 flex flex-wrap flex-1 flex-col h-[calc(80vh-5rem)] min-h-0 overflow-hidden">
      <div className="mb-6 flex gap-2 flex-row items-center justify-start">
        <div>
          <SearchBar onSearch={onSearch} />
        </div>
        <CategorySelect value={category} onChange={setCategory} />
        <SizeSelect value={size} onChange={setSize} />
        <SortToggle
          sortBy={sortKey}
          ascending={ascending}
          onChange={(k, asc) => {
            setSortKey(k);
            setAscending(asc);
          }}
        />
        <NewItemButton onClick={() => setIsAddModalOpen(true)} />
        <AddItem
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onCreated={(record) => {
            setResults((prev) => [record, ...(prev ?? ITEMS)]);
            setIsAddModalOpen(false);
          }}
        />
        <div className="flex flex-1 justify-end gap-2">
          <button
            onClick={() => setViewMode("table")}
            className={`p-1 rounded hover:bg-gray-200"}`}
          >
            <svg
              width="23"
              height="20"
              viewBox="0 0 23 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                y="0.5"
                width="23"
                height="4"
                fill={viewMode === "table" ? "#505050" : "#C0C0C0"}
              />
              <rect
                y="5.5"
                width="23"
                height="4"
                fill={viewMode === "table" ? "#505050" : "#C0C0C0"}
              />
              <rect
                y="10.5"
                width="23"
                height="4"
                fill={viewMode === "table" ? "#505050" : "#C0C0C0"}
              />
              <rect
                y="15.5"
                width="23"
                height="4"
                fill={viewMode === "table" ? "#505050" : "#C0C0C0"}
              />
            </svg>
          </button>

          <button
            onClick={() => setViewMode("gallery")}
            className={`p-1 rounded hover:bg-gray-200"}`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="6"
                height="6"
                fill={viewMode === "gallery" ? "#505050" : "#C0C0C0"}
              />
              <rect
                x="7"
                width="6"
                height="6"
                fill={viewMode === "gallery" ? "#505050" : "#C0C0C0"}
              />
              <rect
                x="14"
                width="6"
                height="6"
                fill={viewMode === "gallery" ? "#505050" : "#C0C0C0"}
              />
              <rect
                y="7"
                width="6"
                height="6"
                fill={viewMode === "gallery" ? "#505050" : "#C0C0C0"}
              />
              <rect
                x="7"
                y="7"
                width="6"
                height="6"
                fill={viewMode === "gallery" ? "#505050" : "#C0C0C0"}
              />
              <rect
                x="14"
                y="7"
                width="6"
                height="6"
                fill={viewMode === "gallery" ? "#505050" : "#C0C0C0"}
              />
              <rect
                y="14"
                width="6"
                height="6"
                fill={viewMode === "gallery" ? "#505050" : "#C0C0C0"}
              />
              <rect
                x="7"
                y="14"
                width="6"
                height="6"
                fill={viewMode === "gallery" ? "#505050" : "#C0C0C0"}
              />
              <rect
                x="14"
                y="14"
                width="6"
                height="6"
                fill={viewMode === "gallery" ? "#505050" : "#C0C0C0"}
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 flex-wrap overflow-y-auto min-h-0 min-w-0">
        {viewMode === "gallery" ? (
          <div className="grid grid-cols-4 gap-6">
            {itemsToDisplay.map((record) => (
              <div
                key={record.id}
                onClick={() => {
                  setSelectedItem(MOCK_DONATION_ITEM(record));
                  setSelectedDR(MOCK_DONATION_REQUEST);
                  setIsItemModalOpen(true);
                }}
                className="cursor-pointer hover:scale-[1.02] transition-transform duration-150"
              >
                <GalleryItem
                  item={record}
                  onDeleted={(id) => {
                    // update backend results state so gallery refreshes
                    setResults((prev) => {
                      const base = prev ?? itemsToDisplay;
                      return base.filter((r) => r.id !== id);
                    });
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <TableView
          inventoryRecords={itemsToDisplay}
          openItem={(record) => {
            setSelectedItem(MOCK_DONATION_ITEM(record));
          setSelectedDR(MOCK_DONATION_REQUEST);
          setIsItemModalOpen(true);
          }}
          onDeleted={(id) => {
            setResults((prev) => {
          const base = prev ?? itemsToDisplay;
          return base.filter((r) => r.id !== id);
      });
  }}
/>

        )}
      </div>
      {selectedItem && selectedDR && isItemModalOpen && (
        <InventoryItemView
          dr={selectedDR}
          //currently using frontend implementation to test item view, will implement backend later
          item={MOCK_DONATION_ITEM(ITEMS[0])}
          onClose={() => setIsItemModalOpen(false)}     />
      )}
    </div>
  );
}
