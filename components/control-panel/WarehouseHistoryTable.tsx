"use client";

import { WarehouseChange } from "@/types/changelog";
import { useState } from "react";
import { ConfirmModal } from "./ConfirmModal";

type WarehouseHistoryTableProps = {
    changes: WarehouseChange[];
    onRevert: (change: WarehouseChange) => Promise<void>;
    isReverting: boolean;
};

function buildRevertMessage(change: WarehouseChange): string {
    const { changeType, itemName, changeAmount, amountBefore, amountAfter } = change;
    const abs = Math.abs(changeAmount);
    const item = itemName.toLowerCase();
    switch (changeType) {
        case "Add":
            return `${abs} ${item}${abs !== 1 ? "s" : ""} will be removed back to the ${amountBefore} in inventory. The amount of ${item}s will be set to ${amountBefore}.`;
        case "Remove":
            return `${abs} ${item}${abs !== 1 ? "s" : ""} will be added back to the ${amountBefore} in inventory. The amount of ${item}s will be set to ${amountBefore}.`;
        case "Set":
            return `${itemName} will be reverted from ${amountAfter} back to ${amountBefore}.`;
        case "Create":
            return `${itemName} will be removed from inventory.`;
        default:
            return `This change to ${itemName} will be reverted.`;
    }
}

export function WarehouseHistoryTable({ changes, onRevert, isReverting }: WarehouseHistoryTableProps) {
    const [pendingRevert, setPendingRevert] = useState<WarehouseChange | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);

    return (
        <>
            {pendingRevert && (
                <ConfirmModal
                    title="Revert this change?"
                    message={buildRevertMessage(pendingRevert)}
                    confirmLabel="Revert"
                    disabled={isConfirming}
                    onConfirm={async () => {
                        if (isConfirming) return;
                        setIsConfirming(true);
                        try {
                            await onRevert(pendingRevert);
                            setPendingRevert(null);
                        } catch {
                            // modal stays open; mutation's onError shows toast
                        } finally {
                            setIsConfirming(false);
                        }
                    }}
                    onCancel={() => setPendingRevert(null)}
                />
            )}

            <div className="w-full h-full flex flex-col overflow-auto min-h-0 gap-2">
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
        </>
    );
}

function buildDescription(change: WarehouseChange): string {
    const { changeType, itemName, changeAmount, amountBefore, amountAfter } = change;
    const abs = Math.abs(changeAmount);
    switch (changeType) {
        case "Add":
            return `added ${abs} ${itemName} (${amountBefore}→${amountAfter})`;
        case "Remove":
            return `removed ${abs} ${itemName} (${amountBefore}→${amountAfter})`;
        case "Create":
            return `created ${itemName} with ${amountAfter} in stock`;
        case "Delete":
            return `deleted ${itemName} (had ${amountBefore} in stock)`;
        case "Set":
            return `set ${itemName} (${amountBefore}→${amountAfter})`;
        default:
            return `${changeType} ${itemName}`;
    }
}

function WarehouseHistoryRow({
    change,
    onRevert,
    isReverting,
}: {
    change: WarehouseChange;
    onRevert: () => void;
    isReverting: boolean;
}) {
    const date = new Date(change.timestamp.seconds * 1000);
    const dateStr = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    const timeStr = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

    const isPositive = change.changeType === "Add" || change.changeType === "Create";
    const isNegative = change.changeType === "Remove" || change.changeType === "Delete";
    const rowBg = isPositive ? "bg-[#F2FAF2]" : isNegative ? "bg-[#FAF2F2]" : "bg-white";

    const namePart = change.userEmail.split("@")[0];
    const displayName = namePart
        .split(/[._-]/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-sm border border-[#DCDDDD] text-sm font-family-roboto ${rowBg}`}>
            <div className="shrink-0 w-5 h-5">
                {isPositive ? (
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-[#69C22E]">
                        <circle cx="10" cy="10" r="8" />
                        <path d="M10 6v8M6 10h8" strokeLinecap="round" />
                    </svg>
                ) : isNegative ? (
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-[#E16060]">
                        <circle cx="10" cy="10" r="8" />
                        <path d="M6 10h8" strokeLinecap="round" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-blue-400">
                        <circle cx="10" cy="10" r="8" />
                        <path d="M10 7v6M7 10h6" strokeLinecap="round" />
                    </svg>
                )}
            </div>

            <span className="w-[14%] shrink-0 text-xs text-[#666666]">{dateStr} {timeStr}</span>

            <div className="w-px h-5 bg-[#D9D9D9] shrink-0" />

            <span className="shrink-0 bg-[#D4F0ED] text-[#003530] text-xs font-medium px-2.5 py-1 rounded-sm">
                {displayName}
            </span>

            <span className="flex-1 text-sm text-[#666666] truncate">
                {buildDescription(change)}
            </span>

            <button
                className="shrink-0 flex items-center gap-1 text-xs border border-[#BBBDBE] rounded-full px-3 py-1 bg-[#BBBDBE] text-white hover:bg-gray-400 disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={onRevert}
                disabled={isReverting || change.changeType === "Delete"}
                title={change.changeType === "Delete" ? "Cannot revert a deletion" : "Revert this change"}
            >
                <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M2 8a6 6 0 106-6H5M2 8l3-3M2 8l3 3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Revert
            </button>
        </div>
    );
}
