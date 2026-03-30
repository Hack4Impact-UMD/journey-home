"use client";

import { useState } from "react";
import { SearchBox } from "@/components/inventory/SearchBox";
import { SortOption } from "@/components/inventory/SortOption";
import { DropdownMultiselect } from "@/components/inventory/DropdownMultiselect";
import { WarehouseHistoryTable } from "@/components/control-panel/WarehouseHistoryTable";
import { useWarehouseHistory } from "@/lib/queries/changelog";
import { useAuth } from "@/contexts/AuthContext";
import { SortStatus } from "@/types/inventory";
import { InventoryChangeType, WarehouseChange } from "@/types/changelog";

const ALL_CHANGE_TYPES: InventoryChangeType[] = ["Add", "Remove", "Create", "Delete", "Set"];

export default function WarehouseHistoryPage() {
    const { state: { userData } } = useAuth();
    const actor = userData ? { userId: userData.uid, userEmail: userData.email } : undefined;

    const [searchQuery, setSearchQuery] = useState("");
    const [dateSortStatus, setDateSortStatus] = useState<SortStatus>("desc");
    const [timeSortStatus, setTimeSortStatus] = useState<SortStatus>("none");
    const [selectedChangeTypes, setSelectedChangeTypes] = useState<InventoryChangeType[]>([...ALL_CHANGE_TYPES]);

    const { changes, isLoading, isError, revert, isReverting } = useWarehouseHistory();

    const filtered = changes
        .filter((c: WarehouseChange) => {
            if (selectedChangeTypes.length > 0 && !selectedChangeTypes.includes(c.changeType)) return false;
            if (!searchQuery) return true;
            const q = searchQuery.toLowerCase();
            return (
                c.itemName.toLowerCase().includes(q) ||
                c.userEmail.toLowerCase().includes(q) ||
                c.changeType.toLowerCase().includes(q)
            );
        })
        .sort((a, b) => {
            // time sort takes priority if active, otherwise date sort
            const activeSort = timeSortStatus !== "none" ? timeSortStatus : dateSortStatus;
            const diff = a.timestamp.seconds - b.timestamp.seconds;
            return activeSort === "asc" ? diff : -diff;
        });

    function handleExport() {
        if (filtered.length === 0) return;
        const escapeCsv = (value: unknown) => {
            let s = String(value ?? "");
            if (/^[=+\-@]/.test(s)) s = `'${s}`;
            s = s.replace(/"/g, '""');
            return /[",\n]/.test(s) ? `"${s}"` : s;
        };
        const headers = ["Date", "Time", "Change Type", "Item", "Change Amount", "Before", "After", "User"];
        const rows = filtered.map((c) => {
            const d = new Date(c.timestamp.seconds * 1000);
            return [
                escapeCsv(d.toLocaleDateString()),
                escapeCsv(d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })),
                escapeCsv(c.changeType),
                escapeCsv(c.itemName),
                escapeCsv(c.changeAmount),
                escapeCsv(c.amountBefore),
                escapeCsv(c.amountAfter),
                escapeCsv(c.userEmail),
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
                <div className="flex-1">
                    <SearchBox
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onSubmit={() => {}}
                    />
                </div>
                <SortOption
                    label="Date"
                    status={dateSortStatus}
                    onChange={(s) => { setDateSortStatus(s); setTimeSortStatus("none"); }}
                />
                <SortOption
                    label="Time"
                    status={timeSortStatus}
                    onChange={(s) => { setTimeSortStatus(s); setDateSortStatus("none"); }}
                />
                <DropdownMultiselect
                    label="Change"
                    options={ALL_CHANGE_TYPES}
                    selected={selectedChangeTypes}
                    setSelected={setSelectedChangeTypes}
                />
                <div>
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
