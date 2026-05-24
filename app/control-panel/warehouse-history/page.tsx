"use client";

import { useState } from "react";
import { SearchBox } from "@/components/inventory/SearchBox";
import { SortOption } from "@/components/inventory/SortOption";
import { DropdownMultiselect } from "@/components/inventory/DropdownMultiselect";
import { WarehouseHistoryTable } from "@/components/control-panel/WarehouseHistoryTable";
import { useWarehouseHistory } from "@/lib/queries/warehouse-history";
import { useInventoryCategories } from "@/lib/queries/inventory";
import { useAllActiveAccounts } from "@/lib/queries/users";
import { useAuth } from "@/contexts/AuthContext";
import { SortStatus, InventoryChange } from "@/types/inventory";
import { toast } from "sonner";

export default function WarehouseHistoryPage() {
    const { state: { userData } } = useAuth();
    const userId = userData?.uid;

    const [searchQuery, setSearchQuery] = useState("");
    const [dateSortStatus, setDateSortStatus] = useState<SortStatus>("desc");
    const [selectedTypes, setSelectedTypes] = useState<("Additions" | "Deletions")[]>(["Additions", "Deletions"]);

    const { changes, isLoading, isError } = useWarehouseHistory();
    const { inventoryCategories, setInventoryCategory, isMutating } = useInventoryCategories();
    const { allAccounts } = useAllActiveAccounts();
    const userById = new Map(allAccounts.map((u) => [u.uid, u]));

    const filtered = changes
        .filter((c: InventoryChange) => {
            const allSelected = selectedTypes.length === 2;
            if (!allSelected && selectedTypes.length > 0) {
                const delta = c.change.newQuantity - c.change.oldQuantity;
                if (delta > 0 && !selectedTypes.includes("Additions")) return false;
                if (delta <= 0 && !selectedTypes.includes("Deletions")) return false;
            }
            if (!searchQuery) return true;
            const q = searchQuery.toLowerCase();
            const user = userById.get(c.userId);
            const userEmail = user?.email ?? "";
            const userName = user ? `${user.firstName} ${user.lastName}` : "";
            return (
                c.change.category.toLowerCase().includes(q) ||
                userEmail.toLowerCase().includes(q) ||
                userName.toLowerCase().includes(q)
            );
        })
        .sort((a, b) => {
            const diff = a.timestamp.seconds - b.timestamp.seconds;
            return dateSortStatus === "asc" ? diff : -diff;
        });

    async function handleRevert(change: InventoryChange) {
        const category = inventoryCategories.find(c => c.name === change.change.category);
        if (!category) {
            toast.error("Category not found.");
            return;
        }
        if (!userId) {
            toast.error("User ID not available.");
            return;
        }
        const delta = change.change.newQuantity - change.change.oldQuantity;
        const promise = setInventoryCategory({ ...category, quantity: category.quantity - delta }, userId, change);
        await toast.promise(promise, {
            loading: "Reverting change...",
            success: "Change reverted successfully.",
            error: "Failed to revert change.",
        });
    }

    return (
        <>
            <div className="flex flex-col mb-6">
                <div className="flex flex-wrap gap-3">
                    <SearchBox
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onSubmit={() => {}}
                    />
                    <SortOption
                        label="Date"
                        status={dateSortStatus}
                        onChange={setDateSortStatus}
                    />
                    <DropdownMultiselect
                        label="Type"
                        options={["Additions", "Deletions"]}
                        selected={selectedTypes}
                        setSelected={setSelectedTypes}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex-1 flex items-center justify-center text-sm text-[#A2A2A2]">
                    Loading history...
                </div>
            ) : isError ? (
                <div className="flex-1 flex items-center justify-center text-sm text-red-500">
                    Failed to load history. Please try again.
                </div>
            ) : (
                <div className="flex-1 min-h-0">
                    <WarehouseHistoryTable
                        changes={filtered}
                        userById={userById}
                        inventoryCategories={inventoryCategories}
                        onRevert={handleRevert}
                        isReverting={isMutating || !userId}
                    />
                </div>
            )}
        </>
    );
}
