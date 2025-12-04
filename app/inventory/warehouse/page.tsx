// app/inventory/warehouse/page.tsx
"use client";

import type {
    InventoryRecord,
    ItemSize
} from "@/types/inventory";
import { use, useEffect, useState } from "react";
import { GridIcon } from "@/components/icons/GridIcon";
import { RowsIcon } from "@/components/icons/RowsIcon";
import {
    deleteInventoryRecord,
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
import { SetItemModal } from "@/components/inventory/SetItemModal";
import { PlusIcon } from "lucide-react";
import { Timestamp } from "firebase/firestore";
import { WarehouseGallery } from "@/components/inventory/WarehouseGallery";
import { ItemViewModal } from "@/components/inventory/ItemViewModal";

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
    const [openedItem, setOpenedItem] = useState<InventoryRecord | null>(null);

    function editItem(updated: InventoryRecord) {
        const adding = newItem !== null;
        toast.promise(
            setInventoryRecord(updated).then((success) => {
                if (success) {
                    setEditedItem(null);
                    setNewItem(null);
                    setAllItems((prevItems) => 
                        (!adding) ? 
                        prevItems.map((item) =>
                            item.id === updated.id ? updated : item
                        ) :
                        [...prevItems, updated]
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

    function deleteItem(deleted: InventoryRecord) {
        if(!window.confirm("Are you sure you want to delete "+deleted.name+"?"))
            return;
        
        setOpenedItem(old => old && old.id == deleted.id ? null : old);

        toast.promise(
            deleteInventoryRecord(deleted.id).then(() => 
                setAllItems(prevItems =>
                    prevItems.filter((item) => item.id !== deleted.id)
                )
            ),
            {
                loading: "Deleting item...",
                success: "Item deleted successfully!",
                error: "Error: Couldn't delete item",
            }
        );
    }

    useEffect(() => {
        getAllWarehouseInventoryRecords().then(setAllItems);
        getCategories().then((categories) => {
            setSelectedCategories(categories);
        });
    }, []);

    const items = allItems.
        filter(x => selectedCategories.includes(x.category) 
            && selectedSizes.includes(x.size)
            && `${x.name}${x.category}${x.notes}${x.size}${x.donorEmail}`.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .toSorted((a, b) => {
            if (sortBy === "Date") {
                return sortAsc
                    ? a.dateAdded.toDate().getTime() - b.dateAdded.toDate().getTime()
                    : b.dateAdded.toDate().getTime() - a.dateAdded.toDate().getTime();
            } else {
                return sortAsc ? a.quantity - b.quantity : b.quantity - a.quantity;
            }
        });

    return (
        <>  
            {editedItem !== null && (
                <SetItemModal
                    item={editedItem}
                    isCreate={false}
                    onClose={() => setEditedItem(null)}
                    editItem={editItem}
                />
            )}
            {openedItem !== null && (
                <ItemViewModal
                    item={openedItem}
                    onClose={() => setOpenedItem(null)}
                    onEdit={() => {
                        setEditedItem(openedItem);
                        setOpenedItem(null);
                    }}
                    onDelete={() => {
                        deleteItem(openedItem);
                    }}
                />
            )}
            {newItem !== null && (
                <SetItemModal
                    item={newItem}
                    isCreate={true}
                    onClose={() => setNewItem(null)}
                    editItem={editItem}
                />
            )}
            <div className="flex flex-col mb-6">
                <div className="flex">
                    <div className="flex flex-wrap gap-3">
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
                <WarehouseGallery
                    inventoryRecords={items}
                    openItem={setOpenedItem}
                />
                :
                <WarehouseTable
                    inventoryRecords={items}
                    openItem={setOpenedItem}
                    editItem={setEditedItem}
                    deleteItem={deleteItem}
                />
                }
        </>
    );
}
