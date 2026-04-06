"use client";

import { useState } from "react";
import { InventoryCategory } from "@/types/inventory";
import { ItemDial } from "./ItemDial";
import { EditCountModal } from "./EditCountModal";
import { ConfirmChangeModal } from "./ConfirmChangeModal";
import { useInventoryCategories } from "../../lib/queries/inventory";

interface ModalState {
    category: InventoryCategory;
    stage: "edit" | "confirm";
    pendingCount?: number;
}

export function CategoryDialsGrid({ categories }: { categories: InventoryCategory[] }) {
    const [modal, setModal] = useState<ModalState | null>(null);
    const { setInventoryCategoryWithToast } = useInventoryCategories();

    function handleCardClick(category: InventoryCategory) {
        setModal({ category, stage: "edit" });
    }

    function handleEditSubmit(newCount: number) {
        if (!modal) return;
        setModal({ ...modal, stage: "confirm", pendingCount: newCount });
    }

    async function handleConfirm() {
        if (!modal || modal.pendingCount === undefined) return;
        await setInventoryCategoryWithToast({
            ...modal.category,
            quantity: modal.pendingCount,
        });
        setModal(null);
    }

    function handleClose() {
        setModal(null);
    }

    if (categories.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center text-sm text-[#BFBFBF]">
                No categories found.
            </div>
        );
    }

    return (
        <>
            <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
                {categories.map((category) => (
                    <ItemDial
                        key={category.id}
                        category={category}
                        onClick={() => handleCardClick(category)}
                    />
                ))}
            </div>

            {modal?.stage === "edit" && (
                <EditCountModal
                    category={modal.category}
                    onClose={handleClose}
                    onSubmit={handleEditSubmit}
                />
            )}

            {modal?.stage === "confirm" && modal.pendingCount !== undefined && (
                <ConfirmChangeModal
                    category={modal.category}
                    newCount={modal.pendingCount}
                    onClose={handleClose}
                    onConfirm={handleConfirm}
                />
            )}
        </>
    );
}