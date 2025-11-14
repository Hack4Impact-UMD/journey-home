// app/inventory/warehouse/page.tsx
"use client";

import GalleryItem from "@/components/GalleryItem";
import SortToggle, { SortKeyToggle } from "@/components/SortToggle";
import AddItem from "@/components/AddItem";
import type { InventoryRecord, SearchParams } from "@/types/inventory";
import { Timestamp } from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { deleteInventoryRecord, search, search as searchBackend, setInventoryRecord } from "@/lib/services/inventory";
import NewItemButton from "@/components/NewItemButton";
import { DonationItem, DonationRequest } from "@/types/donations";
import { TableView } from "@/components/TableView";
import { InventoryItemView } from "@/components/InventoryItemView";
import { SearchBox } from "@/components/inventory/SearchBox";
import { SortOption } from "@/components/inventory/SortOption";
import { getDonationRequest } from "@/lib/services/donations";

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
  const [selectedItem, setSelectedItem] = useState<DonationItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"gallery" | "table">("gallery");
  const [selectedDR, setSelectedDR] = useState<DonationRequest | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({ categories:[], sizes:[], sortBy: "Date", ascending:false})
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    searchBackend("", searchParams)
      .then((data) => setResults(data))
      .catch(() => setResults([]));
  }, [searchParams]);

  const itemsToDisplay = results && results.length > 0 ? results : [];

  const handleOpenItem = async (record: InventoryRecord) => {
  try {
    let dr = await getDonationRequest(record.id); 
    //since there aren't any donationRequests in the backend, item view will not show up unless there is a pre-existing donation request in firebase
    //so we've added a default one for now and will re-implement later
    if (!dr) {
      dr = {
        id: record.id,
        donor: {
          firstName: "Hack", lastName: "4Impact", email: "hack4impact",
          phoneNumber: "",
          address: {
            streetAddress: "UMD",
            city: "College Park",
            state: "MD",
            zipCode: ""
          }
        },
        date: Timestamp.now(),
        items: [MOCK_DONATION_ITEM(record)],
        firstTimeDonor: false,
        howDidYouHear: "",
        canDropOff: false,
        notes: "",
      };
    }
    setSelectedDR(dr); 
    setSelectedItem(MOCK_DONATION_ITEM(record)); 
    setIsItemModalOpen(true); 
    
  } catch (err) {
    console.error("Failed to load donation request", err);
  }
};

  return (
    <div className="p-3 flex flex-wrap flex-1 flex-col h-[calc(80vh-5rem)] min-h-0 overflow-hidden">
      <div className="flex items-center justify-between gap-3 mb-6">
      <div className="flex gap-3">
          <SearchBox value={searchQuery} onChange={setSearchQuery} 
            onSubmit={() => {
              search(searchQuery, searchParams).then((res) => {
              setResults(res);
            })
          }}/>
          <SortOption 
            label="Date" 
            status={
                (searchParams.sortBy != "Date") ? "none" :
                (searchParams.ascending) ? "asc" : "desc"
            }
            onChange={status => {
                  setSearchParams(prev => ({...prev, sortBy: "Date", ascending: (status == "asc")}));
            }}
          />
          <SortOption 
            label="Qnt" 
            status={
                (searchParams.sortBy != "Quantity") ? "none" :
                (searchParams.ascending) ? "asc" : "desc"
            }
            onChange={status => {
                setSearchParams(prev => ({...prev, sortBy: "Quantity", ascending: (status == "asc")}));
            }}
          />
          <NewItemButton onClick={() => setIsAddModalOpen(true)} />
      </div>
      <div className="flex-col mb-6 gap-3">
        <AddItem
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onCreated={(record) => {
            setResults((prev) => [record, ...(prev ?? [])]);
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
    </div>

      <div className="flex-1 flex-wrap overflow-y-auto min-h-0 min-w-0">
        {viewMode === "gallery" ? (
          <div className="grid grid-cols-4 gap-6">
            {itemsToDisplay.map((record) => (
              <div
                key={record.id}
                className="cursor-pointer hover:scale-[1.02] transition-transform duration-150"
              >
                <GalleryItem
                  item={record}
                  onClick={() => void handleOpenItem(record)}
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
          openItem={(record) => void handleOpenItem(record)}
          onDelete={async (id: string) => {
            await deleteInventoryRecord(id);
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
          item={selectedItem}
          onClose={() => setIsItemModalOpen(false)}     />
      )}
    </div>
    
  );
}
