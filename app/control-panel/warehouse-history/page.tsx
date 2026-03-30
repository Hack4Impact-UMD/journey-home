"use client";

import { useState } from "react";
import { SearchBox } from "@/components/inventory/SearchBox";
import { SortOption } from "@/components/inventory/SortOption";
import { WarehouseHistoryTable } from "@/components/control-panel/WarehouseHistoryTable";
import { useWarehouseHistory } from "@/lib/queries/changelog";
import { useAuth } from "@/contexts/AuthContext";
import { SortStatus } from "@/types/inventory";
import { WarehouseChange } from "@/types/changelog";

export default function WarehouseHistoryPage() {
    const { state: { userData } } = useAuth();
    const actor = userData ? { userId: userData.uid, userEmail: userData.email } : undefined;

    const [searchQuery, setSearchQuery] = useState("");
    const [sortStatus, setSortStatus] = useState<SortStatus>("desc");

    const { changes, isLoading, isError, revert, isReverting } = useWarehouseHistory();

    const filtered = changes
        .filter((c: WarehouseChange) => {
            if (!searchQuery) return true;
            const q = searchQuery.toLowerCase();
            return (
                c.itemName.toLowerCase().includes(q) ||
                c.userEmail.toLowerCase().includes(q) ||
                c.changeType.toLowerCase().includes(q)
            );
        })
        .sort((a, b) => {
            const diff = a.timestamp.seconds - b.timestamp.seconds;
            return sortStatus === "asc" ? diff : -diff;
        });

    function handleExport() {
        if (filtered.length === 0) return;
        const headers = ["Date", "Time", "Change Type", "Item", "Change Amount", "Before", "After", "User"];
        const rows = filtered.map((c) => {
            const d = new Date(c.timestamp.seconds * 1000);
            return [
                d.toLocaleDateString("en-US"),
                d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
                c.changeType,
                c.itemName,
                c.changeAmount,
                c.amountBefore,
                c.amountAfter,
                c.userEmail,
            ].join(",");
        });
        const csv = [headers.join(","), ...rows].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "warehouse-history.csv";
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <>
            <div className="flex gap-3 mb-4 shrink-0 items-center">
                <SearchBox
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onSubmit={() => {}}
                />
                <SortOption
                    label="Date"
                    status={sortStatus}
                    onChange={setSortStatus}
                />
                <div className="ml-auto">
                    <button
                        onClick={handleExport}
                        disabled={filtered.length === 0}
                        className="flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 h-8 rounded-sm hover:opacity-90 disabled:opacity-50"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M10 3v10M10 3l-3 3M10 3l3 3M4 13v2a1 1 0 001 1h10a1 1 0 001-1v-2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Export
                    </button>
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
                <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                    <WarehouseHistoryTable
                        changes={filtered}
                        onRevert={(change) => revert({ change, actor })}
                        isReverting={isReverting}
                    />
                </div>
            )}
        </>
    );
}
