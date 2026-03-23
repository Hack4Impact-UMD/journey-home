"use client";

import { InventoryChange } from "@/types/inventory";
import { useState } from "react";
import { ConfirmModal } from "./ConfirmModal";

type WarehouseHistoryTableProps = {
    changes: InventoryChange[];
    onRevert: (change: InventoryChange) => void;
    isReverting: boolean;
};

export function WarehouseHistoryTable({
    changes,
    onRevert,
    isReverting,
}: WarehouseHistoryTableProps) {
    const [pendingRevert, setPendingRevert] = useState<InventoryChange | null>(null);

    return (
        <>
            {pendingRevert && (
                <ConfirmModal
                    title="Revert Change"
                    message={`Are you sure you want to revert the "${pendingRevert.changeType}" change on "${pendingRevert.itemName}"? This will restore the quantity from ${pendingRevert.amountAfter} back to ${pendingRevert.amountBefore}.`}
                    confirmLabel="Revert"
                    danger
                    onConfirm={() => {
                        onRevert(pendingRevert);
                        setPendingRevert(null);
                    }}
                    onCancel={() => setPendingRevert(null)}
                />
            )}

            <div className="w-full h-full flex flex-col">
                {/* Header */}
                <div className="h-12 bg-[#FAFAFB] border-light-border border flex items-center font-family-roboto font-bold text-sm text-text-1 shrink-0">
                    <span className="w-[12%] border-l-2 border-light-border px-4">Change</span>
                    <span className="w-[16%] border-l-2 border-light-border px-4">Item</span>
                    <span className="w-[10%] border-l-2 border-light-border px-4">Change Amt</span>
                    <span className="w-[10%] border-l-2 border-light-border px-4">Amt Before</span>
                    <span className="w-[10%] border-l-2 border-light-border px-4">Amt After</span>
                    <span className="w-[12%] border-l-2 border-light-border px-4">Date</span>
                    <span className="w-[10%] border-l-2 border-light-border px-4">Time</span>
                    <span className="w-[14%] border-l-2 border-light-border px-4">User</span>
                    <span className="w-[6%] border-l-2 border-light-border px-4">Actions</span>
                </div>

                {/* Rows */}
                <div className="flex-1 overflow-auto min-h-0">
                    {changes.length === 0 && (
                        <div className="flex items-center justify-center h-24 text-sm text-[#A2A2A2]">
                            No history entries found.
                        </div>
                    )}
                    {changes.map((change) => (
                        <WarehouseHistoryRow
                            key={change.id}
                            change={change}
                            onRevert={() => setPendingRevert(change)}
                            isReverting={isReverting}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

function WarehouseHistoryRow({
    change,
    onRevert,
    isReverting,
}: {
    change: InventoryChange;
    onRevert: () => void;
    isReverting: boolean;
}) {
    const date = new Date(change.timestamp.seconds * 1000);

    const changeTypeColor: Record<string, string> = {
        Create: "text-green-600",
        Set: "text-blue-600",
        Add: "text-green-600",
        Remove: "text-orange-500",
        Delete: "text-red-500",
    };

    const amtColor =
        change.changeAmount > 0
            ? "text-green-600"
            : change.changeAmount < 0
            ? "text-red-500"
            : "text-text-1";

    return (
        <div className="h-10 border-light-border border-b border-x flex items-center font-family-roboto text-sm text-text-1">
            <span className={`w-[12%] px-4 font-medium ${changeTypeColor[change.changeType] ?? ""}`}>
                {change.changeType}
            </span>
            <span className="w-[16%] px-4 truncate">{change.itemName}</span>
            <span className={`w-[10%] px-4 ${amtColor}`}>
                {change.changeAmount > 0 ? `+${change.changeAmount}` : change.changeAmount}
            </span>
            <span className="w-[10%] px-4">{change.amountBefore}</span>
            <span className="w-[10%] px-4">{change.amountAfter}</span>
            <span className="w-[12%] px-4">
                {date.toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "2-digit",
                })}
            </span>
            <span className="w-[10%] px-4">
                {date.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                })}
            </span>
            <span className="w-[14%] px-4 truncate text-xs">{change.userEmail}</span>
            <div className="w-[6%] px-4">
                <button
                    className="text-xs border border-light-border rounded-xs px-2 py-0.5 hover:bg-gray-50 disabled:opacity-50"
                    onClick={onRevert}
                    disabled={isReverting || change.changeType === "Delete"}
                    title={change.changeType === "Delete" ? "Cannot revert a deletion" : "Revert this change"}
                >
                    Revert
                </button>
            </div>
        </div>
    );
}
