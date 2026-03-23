"use client";

import { useState, useMemo } from "react";
import { SearchBox } from "@/components/inventory/SearchBox";
import { SortOption } from "@/components/inventory/SortOption";
import { DropdownMultiselect } from "@/components/inventory/DropdownMultiselect";
import { WarehouseHistoryTable } from "@/components/control-panel/WarehouseHistoryTable";
import { useWarehouseHistory, useRevertChange } from "@/lib/queries/changelog";
import { useAuth } from "@/contexts/AuthContext";
import { InventoryChange, InventoryChangeType, SortStatus } from "@/types/inventory";

const CHANGE_TYPES: InventoryChangeType[] = ["Create", "Set", "Add", "Remove", "Delete"];

function getMillis(t: { seconds: number; nanoseconds: number; toMillis?: () => number }) {
    return t.toMillis?.() ?? (t.seconds * 1000 + t.nanoseconds / 1e6);
}

export default function WarehouseHistoryPage() {
    const { state: { userData } } = useAuth();
    const actor = userData ? { userId: userData.uid, userEmail: userData.email } : undefined;

    const [searchQuery, setSearchQuery] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [selectedTypes, setSelectedTypes] = useState<InventoryChangeType[]>([...CHANGE_TYPES]);
    const [dateSortStatus, setDateSortStatus] = useState<SortStatus>("desc");
    const [timeSortStatus, setTimeSortStatus] = useState<SortStatus>("none");

    const { changes, isLoading } = useWarehouseHistory();
    const revertMutation = useRevertChange();

    const filtered = useMemo(() => {
        let result = changes.filter((c: InventoryChange) => {
            const matchesSearch =
                !appliedSearch ||
                c.itemName.toLowerCase().includes(appliedSearch.toLowerCase()) ||
                c.userEmail.toLowerCase().includes(appliedSearch.toLowerCase()) ||
                c.changeType.toLowerCase().includes(appliedSearch.toLowerCase());

            return matchesSearch && selectedTypes.includes(c.changeType);
        });

        const activeSortStatus = dateSortStatus !== "none" ? dateSortStatus : timeSortStatus;
        if (activeSortStatus !== "none") {
            result = [...result].sort((a, b) => {
                const diff = getMillis(a.timestamp) - getMillis(b.timestamp);
                return activeSortStatus === "asc" ? diff : -diff;
            });
        }

        return result;
    }, [changes, appliedSearch, selectedTypes, dateSortStatus, timeSortStatus]);

    return (
        <>
            <div className="flex flex-wrap gap-3 mb-4 shrink-0">
                <SearchBox
                    value={searchQuery}
                    onChange={(val) => {
                        setSearchQuery(val);
                        if (val === "") setAppliedSearch("");
                    }}
                    onSubmit={() => setAppliedSearch(searchQuery)}
                />
                <DropdownMultiselect
                    label="Change Type"
                    options={CHANGE_TYPES}
                    selected={selectedTypes}
                    setSelected={setSelectedTypes}
                />
                <SortOption
                    label="Date"
                    status={dateSortStatus}
                    onChange={(s) => {
                        setDateSortStatus(s);
                        setTimeSortStatus("none");
                    }}
                />
                <SortOption
                    label="Time"
                    status={timeSortStatus}
                    onChange={(s) => {
                        setTimeSortStatus(s);
                        setDateSortStatus("none");
                    }}
                />
            </div>

            {isLoading ? (
                <div className="flex-1 flex items-center justify-center text-sm text-[#A2A2A2]">
                    Loading history...
                </div>
            ) : (
                <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                    <WarehouseHistoryTable
                        changes={filtered}
                        onRevert={(change) => revertMutation.mutate({ change, actor })}
                        isReverting={revertMutation.isPending}
                    />
                </div>
            )}
        </>
    );
}
