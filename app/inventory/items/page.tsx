"use client";

import { useState, useMemo } from "react";
import { SearchBox } from "@/components/inventory/SearchBox";
import { DropdownMultiselect } from "@/components/inventory/DropdownMultiselect";
import { SortOption } from "@/components/inventory/SortOption";
import { CategoryDialsGrid } from "@/components/inventory/CategoryDialsGrid";
import { useInventoryCategories } from "@/lib/queries/inventory";
import { SortStatus } from "@/types/inventory";
import { PlusIcon, UploadIcon } from "lucide-react";

type StockStatus = "Red" | "Yellow" | "Green";

function getStockStatus(quantity: number, low: number, high: number): StockStatus {
    if (quantity <= low) return "Red";
    if (quantity >= high) return "Green";
    return "Yellow";
}

const ALL_STOCK_STATUSES: StockStatus[] = ["Red", "Yellow", "Green"];

export default function ItemsPage() {
    const { inventoryCategories, isLoading } = useInventoryCategories();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatuses, setSelectedStatuses] = useState<StockStatus[]>([...ALL_STOCK_STATUSES]);
    const [sortByQnt, setSortByQnt] = useState<SortStatus>("none");

    const filtered = useMemo(() => {
        return inventoryCategories
            .filter((cat) => {
                const status = getStockStatus(cat.quantity, cat.lowThreshold, cat.highThreshold);
                return (
                    selectedStatuses.includes(status) &&
                    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
            })
            .toSorted((a, b) => {
                if (sortByQnt !== "none") {
                    return sortByQnt === "asc" ? a.quantity - b.quantity : b.quantity - a.quantity;
                }
                return 0;
            });
    }, [inventoryCategories, searchQuery, selectedStatuses, sortByQnt]);

    return (
        <>
            {/* mt-2 + mb-8: increased spacing above toolbar and between toolbar and grid */}
            <div className="flex items-center gap-3 mb-8 mt-2">
                {/* Extended search bar */}
                <div className="w-1/2 [&>div]:w-full [&>div]:flex [&_form]:w-full [&_input]:flex-1 [&_input]:w-auto">
                    <SearchBox
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onSubmit={() => {}}
                    />
                </div>

                {/* Stock status + Qnt sort */}
                <div className="h-8 flex items-stretch">
                    <DropdownMultiselect
                        label="Stock status"
                        options={ALL_STOCK_STATUSES}
                        selected={selectedStatuses}
                        setSelected={setSelectedStatuses}
                    />
                </div>
                <div className="h-8 flex items-stretch">
                    <SortOption
                        label="Qnt"
                        status={sortByQnt}
                        onChange={setSortByQnt}
                    />
                </div>

                <div className="flex gap-2">
                    <button className="bg-primary text-white font-family-roboto rounded-xs flex gap-2 items-center justify-center text-sm px-3 h-8">
                        <PlusIcon className="h-4 w-4" />
                        <span>Add</span>
                    </button>
                    <button className="bg-primary text-white font-family-roboto rounded-xs flex gap-2 items-center justify-center text-sm px-3 h-8">
                        <UploadIcon className="h-4 w-4" />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            <div className="px-4">
                {isLoading ? (
                    <div className="w-full flex items-center justify-center text-sm text-[#BFBFBF] py-10">
                        Loading...
                    </div>
                ) : (
                    <CategoryDialsGrid categories={filtered} />
                )}
            </div>
        </>
    );
}