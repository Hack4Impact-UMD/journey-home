"use client";

import { useMemo } from "react";
import { AdminWarehousePlus } from "../icons/AdminWarehousePlus";
import { AdminWarehouseMinus } from "../icons/AdminWarehouseMinus";
import { useWarehouseHistory } from "@/lib/queries/warehouse-history";

export default function WarehouseHistorySummary(){
    const {changes: warehouseChanges = [], isLoading} = useWarehouseHistory();

    const sortedChanges = useMemo(() =>
        [...warehouseChanges]
            .filter((c) => c.change.newQuantity !== c.change.oldQuantity)
            .sort((a, b) => b.timestamp.toDate().getTime() - a.timestamp.toDate().getTime()),
        [warehouseChanges]
    );
    const twoDaysAfter = useMemo(() =>
        sortedChanges.filter(
            (c) => Date.now() - c.timestamp.toDate().getTime() <= 48 * 60 * 60 * 1000,
        ).length,
        [sortedChanges]
    );

    const mostRecent = sortedChanges.slice(0,5);

    return (
        <div className="w-full rounded-2xl border border-[#E7E7E7] bg-white shadow-sm p-4 flex flex-col gap-3">
            <div className="flex flex-row place-content-between items-center">
                <span className="font-bold text-lg text-text-1">
                    Latest inventory updates
                </span>
                <span className="text-sm text-gray-400">
                    <span className="font-semibold text-text-1">{twoDaysAfter}</span> new changes
                </span>
            </div>
            {isLoading ? (
                <p className="text-sm text-gray-400">Loading...</p>
            ): mostRecent.length === 0 ? (
                <p className="text-sm text-gray-400">No inventory changes were made</p>
            ) : (
                <div className="flex flex-col gap-2">
                    {mostRecent.map((c) => {
                        const diff = c.change.newQuantity - c.change.oldQuantity;
                        const isPositive = diff > 0;
                        return (
                            <div key={c.id} className="flex items-center gap-3 border border-light-border px-3 py-2">
                                <span className="shrink-0">
                                    {isPositive ? <AdminWarehousePlus /> : <AdminWarehouseMinus />}
                                </span>
                                <span className="text-xs text-gray-400 shrink-0">
                                    {c.timestamp.toDate().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                                </span>
                                <span className="border-l border-gray-200 self-stretch" />
                                <span className="text-sm text-gray-700">
                                    {isPositive ? "added " : "removed "}
                                    {Math.abs(diff)} {c.change.category} ({c.change.oldQuantity} → {c.change.newQuantity})
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
