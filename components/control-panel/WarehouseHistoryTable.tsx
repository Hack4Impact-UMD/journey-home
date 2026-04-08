"use client";

import { InventoryChange, InventoryCategory } from "@/types/inventory";
import { UserData } from "@/types/user";
import { useState } from "react";
import { ConfirmModal } from "@/components/control-panel/ConfirmModal";
import { RevertIcon } from "@/components/icons/RevertIcon";

type WarehouseHistoryTableProps = {
    changes: InventoryChange[];
    userById: Map<string, UserData>;
    inventoryCategories: InventoryCategory[];
    onRevert: (change: InventoryChange) => Promise<unknown>;
    isReverting: boolean;
};

function buildRevertMessage(change: InventoryChange, currentQuantity: number | undefined): string {
    const { category, oldQuantity, newQuantity } = change.change;
    const delta = newQuantity - oldQuantity;
    if (currentQuantity === undefined) {
        return `This will revert the change to ${category}.`;
    }
    const resultQuantity = currentQuantity - delta;
    return `${category} will go from ${currentQuantity} to ${resultQuantity}.`;
}

export function WarehouseHistoryTable({ changes, userById, inventoryCategories, onRevert, isReverting }: WarehouseHistoryTableProps) {
    const [pendingRevert, setPendingRevert] = useState<InventoryChange | null>(null);
    const categoryByName = new Map(inventoryCategories.map(c => [c.name, c]));

    return (
        <>
            {pendingRevert && (
                <ConfirmModal
                    title="Revert this change?"
                    message={buildRevertMessage(pendingRevert, categoryByName.get(pendingRevert.change.category)?.quantity)}
                    onConfirm={() => {
                        const change = pendingRevert;
                        setPendingRevert(null);
                        onRevert(change);
                    }}
                    onCancel={() => setPendingRevert(null)}
                />
            )}

            <div className="w-full h-full flex flex-col">
                <div className="flex-1 overflow-auto min-h-0 flex flex-col gap-2">
                {changes.length === 0 && (
                    <div className="flex items-center justify-center h-24 text-sm text-[#A2A2A2]">
                        No history entries found.
                    </div>
                )}
                {changes.map((change) => {
                    const user = userById.get(change.userId);
                    const displayName = user
                        ? `${user.firstName} ${user.lastName}`
                        : change.userId;
                    return (
                        <WarehouseHistoryRow
                            key={change.id}
                            change={change}
                            displayName={displayName}
                            onRevert={() => setPendingRevert(change)}
                            isReverting={isReverting}
                        />
                    );
                })}
                </div>
            </div>
        </>
    );
}

function buildDescription(change: InventoryChange): string {
    const { category, oldQuantity, newQuantity } = change.change;
    const delta = newQuantity - oldQuantity;
    const verb = delta > 0 ? "added" : delta < 0 ? "removed" : "didn't change";
    const count = Math.abs(delta);
    return delta !== 0
        ? `${verb} ${count} ${category} (${oldQuantity} → ${newQuantity})`
        : `${verb} ${category} (${oldQuantity} → ${newQuantity})`;
}

function WarehouseHistoryRow({
    change,
    displayName,
    onRevert,
    isReverting,
}: {
    change: InventoryChange;
    displayName: string;
    onRevert: () => void;
    isReverting: boolean;
}) {
    const date = new Date(change.timestamp.seconds * 1000);
    const dateStr = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    const timeStr = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

    const delta = change.change.newQuantity - change.change.oldQuantity;
    const isPositive = delta > 0;
    const isNegative = delta < 0;
    const rowBg = isPositive ? "bg-[#F2FAF2]" : isNegative ? "bg-[#FAF2F2]" : "bg-white";

    return (
        <div className={`h-11 flex items-center gap-3 px-4 rounded-sm border border-[#DCDDDD] text-sm font-family-roboto shrink-0 ${rowBg}`}>
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

            <span className="w-30 shrink-0 text-xs text-[#666666]">{dateStr} {timeStr}</span>

            <div className="w-px h-5 bg-[#D9D9D9] shrink-0" />

            <span className="shrink-0 bg-[#D4F0ED] text-[#003530] text-xs font-medium px-2.5 py-1 rounded-sm">
                {displayName}
            </span>

            <span className="flex-1 text-sm text-text-1 truncate">
                {buildDescription(change)}
            </span>

            {change.reverted ? (
                <span className="shrink-0 text-xs bg-[#DCDDDD] text-white rounded-full px-3 py-1">
                    Reverted
                </span>
            ) : (
                <button
                    className="shrink-0 h-5.5 flex items-center gap-1.5 text-xs rounded-full px-3 bg-white text-black hover:bg-gray-50 disabled:cursor-not-allowed"
                    onClick={onRevert}
                    disabled={isReverting}
                >
                    <RevertIcon />
                    Revert
                </button>
            )}
        </div>
    );
}
