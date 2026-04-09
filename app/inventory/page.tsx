"use client";

import { useState, useMemo } from "react";
import { SearchBox } from "@/components/inventory/SearchBox";
import { DropdownMultiselect } from "@/components/inventory/DropdownMultiselect";
import { SortOption } from "@/components/inventory/SortOption";
import { CategoryDialsGrid } from "@/components/inventory/CategoryDialsGrid";
import { useInventoryCategories } from "@/lib/queries/inventory";
import { SortStatus } from "@/types/inventory";
import { Spinner } from "@/components/ui/spinner";

type StockStatus = "Red" | "Yellow" | "Green";
type SortField = "name" | "quantity";

function getStockStatus(quantity: number, low: number, high: number): StockStatus {
    if (quantity <= low) return "Red";
    if (quantity >= high) return "Green";
    return "Yellow";
}

const ALL_STOCK_STATUSES: StockStatus[] = ["Red", "Yellow", "Green"];

export default function InventoryPage() {
    const { inventoryCategories, isLoading, isFetching, isError, refetch } = useInventoryCategories();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatuses, setSelectedStatuses] = useState<StockStatus[]>([...ALL_STOCK_STATUSES]);
    const [sortField, setSortField] = useState<SortField>("name");
    const [sortStatus, setSortStatus] = useState<SortStatus>("asc");
    

    const filtered = useMemo(() => {
      return [...inventoryCategories
        .filter((cat) => {
            const status = getStockStatus(cat.quantity, cat.lowThreshold, cat.highThreshold);
            return (
                selectedStatuses.includes(status) &&
                cat.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        })]
        .sort((a, b) => {
          if (sortField === "name") {
              return sortStatus === "asc"
                  ? a.name.localeCompare(b.name)
                  : b.name.localeCompare(a.name);
          }

          if (sortField === "quantity") {
              return sortStatus === "asc"
                  ? a.quantity - b.quantity
                  : b.quantity - a.quantity;
          }

        return 0;
      });
    }, [inventoryCategories, searchQuery, selectedStatuses, sortField, sortStatus]);

    return (
        <>
            <div className="flex items-center gap-3 mb-8 mt-2">
                <SearchBox
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onSubmit={refetch}
                />

                <div className="h-8 flex items-stretch">
                    <DropdownMultiselect
                        label="Status"
                        options={ALL_STOCK_STATUSES}
                        selected={selectedStatuses}
                        setSelected={setSelectedStatuses}
                    />
                </div>
                <div className="h-8 flex items-stretch">
                  <SortOption
                    label="Name"
                    status={sortField === "name" ? sortStatus : "none"}
                    onChange={(status) => {
                        setSortField("name");
                        setSortStatus(status);
                    }}
                  />
                </div>

                <div className="h-8 flex items-stretch">
                  <SortOption
                    label="Qnt"
                    status={sortField === "quantity" ? sortStatus : "none"}
                    onChange={(status) => {
                        setSortField("quantity");
                        setSortStatus(status);
                    }}
                  />
                </div>

                {isFetching && !isLoading && <Spinner className="size-4 text-primary ml-auto" />}
            </div>

            <div className="flex-1 overflow-auto min-h-0 px-4">
                {isLoading ? (
                    <div className="w-full flex items-center justify-center text-sm text-[#BFBFBF] py-10">
                        <Spinner className="size-5 text-primary" />
                    </div>
                ) : isError ? (
                    <div className="w-full flex items-center justify-center text-sm text-red-500 py-10">
                        Failed to load inventory.
                    </div>
                ) : (
                    <CategoryDialsGrid categories={filtered} />
                )}
            </div>
        </>
    );
}