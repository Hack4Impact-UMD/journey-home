// app/inventory/warehouse/page.tsx
"use client";

import type {
    InventoryRecord,
    ItemSize,
    SearchParams,
} from "@/types/inventory";
import { use, useEffect, useState } from "react";
import { GridIcon } from "@/components/icons/GridIcon";
import { RowsIcon } from "@/components/icons/RowsIcon";
import {
    getAllWarehouseInventoryRecords,
    getCategories,
    setInventoryRecord,
    useCategories,
} from "@/lib/services/inventory";
import { toast } from "sonner";
import { SearchBox } from "@/components/inventory/SearchBox";
import { DropdownMultiselect } from "@/components/inventory/DropdownMultiselect";
import { SortOption } from "@/components/inventory/SortOption";
import { cn } from "@/lib/utils";
import { WarehouseTable } from "@/components/inventory/WarehouseTable";
import { EditItemModal } from "@/components/inventory/SetItemModal";
import { PlusIcon } from "lucide-react";
import { Timestamp } from "firebase/firestore";

export default function WarehousePage() {
    const [searchQuery, setSearchQuery] = useState<string>("");

    const allCategories = useCategories();

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<ItemSize[]>([
        "Small",
        "Medium",
        "Large",
    ]);

    const [sortBy, setSortBy] = useState<"Quantity" | "Date">("Date");
    const [sortAsc, setSortAsc] = useState<boolean>(false);

    const [allItems, setAllItems] = useState<InventoryRecord[]>([]);
    const [isGridDisplay, setIsGridDisplay] = useState<boolean>(true);

    const [editedItem, setEditedItem] = useState<InventoryRecord | null>(
        null
    );

    const [newItem, setNewItem] = useState<InventoryRecord | null>(
        null
    );

    function editItem(updated: InventoryRecord) {
        const adding = newItem !== null;
        toast.promise(
            setInventoryRecord(updated).then((success) => {
                if (success) {
                    setEditedItem(null);
                    setNewItem(null);
                    setAllItems((prevItems) =>
                        prevItems.map((item) =>
                            item.id === updated.id ? updated : item
                        )
                    );
                } else {
                    throw new Error(adding ? "Error: Couldn't add item" : "Error: Couldn't update item");
                }
            }),
            {
                loading: adding ? "Adding item..." : "Updating item...",
                success: adding ?"Item added successfully!" : "Item updated successfully!",
                error: adding ? "Error: Couldn't add item" : "Error: Couldn't update item",
            }
        );
    }

    useEffect(() => {
        getAllWarehouseInventoryRecords().then(setAllItems);
        getCategories().then((categories) => {
            setSelectedCategories(categories);
        });
    }, []);

    return (
        <>
            {editedItem !== null && (
                <EditItemModal
                    item={editedItem}
                    isCreate={false}
                    onClose={() => setEditedItem(null)}
                    editItem={editItem}
                />
            )}
            {newItem !== null && (
                <EditItemModal
                    item={newItem}
                    isCreate={true}
                    onClose={() => setNewItem(null)}
                    editItem={editItem}
                />
            )}
            <div className="flex flex-col mb-6">
                <div className="flex">
                    <div className="flex gap-3">
                        <SearchBox
                            value={searchQuery}
                            onChange={setSearchQuery}
                            onSubmit={() =>
                                getAllWarehouseInventoryRecords().then(
                                    setAllItems
                                )
                            }
                        />
                        <DropdownMultiselect
                            label="Categories"
                            options={allCategories}
                            selected={selectedCategories}
                            setSelected={setSelectedCategories}
                        />
                        <DropdownMultiselect
                            label="Size"
                            options={["Small", "Medium", "Large"]}
                            selected={selectedSizes}
                            setSelected={setSelectedSizes}
                        />
                        <SortOption
                            label="Date"
                            status={
                                sortBy != "Date"
                                    ? "none"
                                    : sortAsc
                                    ? "asc"
                                    : "desc"
                            }
                            onChange={(status) => {
                                setSortBy("Date");
                                setSortAsc(status == "asc");
                            }}
                        />
                        <SortOption
                            label="Qnt"
                            status={
                                sortBy != "Quantity"
                                    ? "none"
                                    : sortAsc
                                    ? "asc"
                                    : "desc"
                            }
                            onChange={(status) => {
                                setSortBy("Quantity");
                                setSortAsc(status == "asc");
                            }}
                        />
                        <button 
                            className="bg-primary text-white font-family-roboto rounded-xs flex gap-2.5 items-center justify-center text-sm px-3"
                            onClick={() => {
                                setNewItem({
                                    id: crypto.randomUUID(),
                                    name: "New Item",
                                    photos: [],
                                    category: "Other",
                                    notes: "",
                                    quantity: 1,
                                    size: "Small",
                                    dateAdded: Timestamp.now(),
                                    donorEmail: null,
                                } as InventoryRecord)
                            }}
                        >
                            <span>New Item</span>
                            <PlusIcon className="h-4 w-4"/>
                        </button>
                    </div>
                    <div className="ml-auto flex gap-2">
                        <button
                            className={cn(
                                "fill-light-border",
                                isGridDisplay && "fill-[#505050]"
                            )}
                            onClick={() => setIsGridDisplay(true)}
                        >
                            <GridIcon />
                        </button>
                        <button
                            className={cn(
                                "fill-light-border",
                                !isGridDisplay && "fill-[#505050]"
                            )}
                            onClick={() => setIsGridDisplay(false)}
                        >
                            <RowsIcon />
                        </button>
                    </div>
                </div>
            </div>
            {isGridDisplay ? 
                <></>
                :
                <WarehouseTable
                    inventoryRecords={allItems}
                    openItem={() => {}}
                    onDelete={() => {}}
                />
                }
        </>
    );
}
