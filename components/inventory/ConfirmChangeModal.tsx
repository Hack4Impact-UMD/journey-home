"use client";

import { InventoryCategory } from "@/types/inventory";

interface ConfirmChangeModalProps {
    category: InventoryCategory;
    newCount: number;
    onClose: () => void;
    onConfirm: () => void;
}

export function ConfirmChangeModal({ category, newCount, onClose, onConfirm }: ConfirmChangeModalProps) {
    const diff = newCount - category.quantity;
    const absDiff = Math.abs(diff);
    const action = diff > 0 ? "added to" : "removed from";
    const itemName = category.name.toLowerCase();

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-[340px] p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-gray-900 mb-3">Change item count?</h2>
                <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                    {absDiff} {itemName}s will be {action} the {category.quantity} in inventory.
                    There will be {newCount} {itemName} remaining.
                </p>

                <div className="flex justify-end">
                    <button
                        onClick={onConfirm}
                        className="bg-[#17B8C4] hover:bg-[#13a3ae] text-white font-medium px-8 py-2.5 rounded-xl transition-colors"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}