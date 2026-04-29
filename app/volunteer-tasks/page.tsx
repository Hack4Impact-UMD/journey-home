"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createPortal } from "react-dom";

import ItemSearch from "@/components/volunteer-tasks/ItemSearch";

import { useInventoryCategories } from "@/lib/queries/inventory";
import { useTimeBlocks } from "@/lib/queries/timeblocks";
import { toast } from "sonner";
import { VolunteerModifyStepOneIcon } from "@/components/icons/VolunteerModifyStepOneIcon";
import { VolunteerModifyStepTwoIcon } from "@/components/icons/VolunteerModifyStepTwoIcon";
import { JourneyTheDogIcon } from "@/components/icons/JourneyTheDogIcon";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { TimeBlock } from "@/types/schedule";
import { formatTime } from "@/lib/utils";

type ItemMap = Record<string, number>;

export default function VolunteerTasks() {
    const { state: { currentUser } } = useAuth();
    const { allTB } = useTimeBlocks();
    const searchParams = useSearchParams();
    const tbId = searchParams.get("id");

    const [screen, setScreen] = useState<"shiftlist" | "shiftoverview" | "modify" | "summary">("shiftlist");
    const [selectedShift, setSelectedShift] = useState<TimeBlock | null>(null);

    const [items, setItems] = useState<ItemMap>({});
    const [summaryMode, setSummaryMode] = useState<"add" | "remove">("remove");
    const [open, setOpen] = useState(false);
    const [notesOpen, setNotesOpen] = useState(true);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    useEffect(() => {
        if (!tbId || !allTB.length) return;
        const tb = allTB.find((t) => t.id === tbId);
        if (tb) { setSelectedShift(tb); setScreen("shiftoverview"); }
    }, [tbId, allTB]);

    const {
        inventoryCategories,
        isLoading,
        isError,
        setInventoryCategoryWithToast,
    } = useInventoryCategories();

    const now = Date.now();
    const todayMidnight = new Date(now);
    todayMidnight.setHours(0, 0, 0, 0);
    const userTimeBlocks = allTB
        .filter((tb) =>
            tb.endTime.toMillis() >= todayMidnight.getTime() &&
            tb.volunteerGroups.some((g) => g.volunterIDs.includes(currentUser!.uid))
        )
        .sort((a, b) => a.startTime.toMillis() - b.startTime.toMillis());
    const handleAddItem = (item: { name: string; qty: number }) => {
        setItems((prev) => ({
            ...prev,
            [item.name]: item.qty,
        }));
        setOpen(false);
    };
    const handleConfirm = async (): Promise<boolean> => {
        if (!currentUser) return false;
        if (summaryMode === "remove") {
            for (const [name, qty] of Object.entries(items)) {
                const category = inventoryCategories.find((c) => c.name === name);
                if (category && qty > category.quantity) {
                    toast.error(`Not enough ${name} in inventory (${category.quantity} available)`);
                    return false;
                }
            }
        }
        const writes = Object.entries(items)
            .map(([name, qty]) => ({ category: inventoryCategories.find((c) => c.name === name), qty }))
            .filter(({ category }) => category != null)
            .map(({ category, qty }) => setInventoryCategoryWithToast({
                id: category!.id,
                name: category!.name,
                quantity: summaryMode === "remove" ? category!.quantity - qty : category!.quantity + qty,
                lowThreshold: category!.lowThreshold,
                highThreshold: category!.highThreshold,
            }, currentUser.uid));
        await Promise.all(writes);
        return true;
    };

    return (
        <div className="h-full flex flex-col">
            {screen === "shiftlist" && (
                <div className="flex flex-col gap-4 pt-4 flex-1 min-h-0 overflow-y-auto">
                    {userTimeBlocks.length === 0 && (
                        <div className="flex flex-1 flex-col items-center justify-center gap-9">
                            <div className="grayscale opacity-40"><JourneyTheDogIcon /></div>
                            <p className="font-family-roboto text-xl text-center text-gray-400">You are not signed up for any shifts!</p>
                        </div>
                    )}
                    {userTimeBlocks.map((tb) => {
                        const shiftDate = tb.startTime.toDate();
                        const dayStart = new Date(shiftDate.getFullYear(), shiftDate.getMonth(), shiftDate.getDate()).getTime();
                        const dayEnd = dayStart + 24 * 60 * 60 * 1000;
                        const isActive = dayStart <= now && now < dayEnd;
                        const userGroup = tb.volunteerGroups.find((g) => g.volunterIDs.includes(currentUser!.uid));
                        const start = tb.startTime.toDate();
                        const timeRange = `${formatTime(tb.startTime.toDate())}-${formatTime(tb.endTime.toDate())}`;
                        const dateLabel = `${start.toLocaleDateString("en-US", { month: "short" }).toUpperCase()}, ${start.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}`;

                        return (
                            <div key={tb.id} className="w-full">
                                <div className="pb-4">
                                    <div className="flex justify-between items-stretch">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-family-roboto font-semibold text-sm shrink-0">
                                                    {start.getDate()}
                                                </div>
                                                <p className="font-family-roboto font-semibold text-sm text-[#6B7A99]">{dateLabel}</p>
                                            </div>
                                            <div className="pl-10">
                                                <p className="text-sm font-family-roboto">{tb.type === "Pickup/Delivery" ? "Pickups / Deliveries" : "Warehouse"}</p>
                                                <p className="text-sm font-family-roboto text-primary">Group: {userGroup?.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end justify-between">
                                            <div className="flex items-center gap-2 h-7">
                                                <div className={`w-3 h-3 rounded-full ${tb.type === "Warehouse" ? "bg-yellow-400" : "bg-primary"}`} />
                                                <span className="text-sm">{timeRange}</span>
                                            </div>
                                            {isActive ? (
                                                <button
                                                    onClick={() => { setSelectedShift(tb); setScreen("shiftoverview"); }}
                                                    className="bg-primary text-white w-22.5 h-8 rounded-sm text-sm"
                                                >
                                                    Open
                                                </button>
                                            ) : (
                                                <button className="border border-gray-300 text-primary w-22.5 h-8 rounded-sm text-sm">
                                                    Upcoming
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                </div>
                                <div className="border-b border-gray-200" />
                            </div>
                        );
                    })}
                </div>
            )}
            {screen === "shiftoverview" && (
                <div className="pt-8 flex flex-col h-full">
                    <p className="font-family-roboto font-medium text-2xl text-primary text-center">Shift Notes</p>
                    <div className="mt-4 flex flex-col gap-4">
                        <button
                            onClick={() => { setItems({}); setSummaryMode("add"); setScreen("modify"); }}
                            className="w-full h-10 bg-primary text-white font-family-roboto rounded-sm"
                        >
                            Add to Inventory
                        </button>
                        <button
                            onClick={() => { setItems({}); setSummaryMode("remove"); setScreen("modify"); }}
                            className="w-full h-10 border border-gray-300 font-family-roboto rounded-sm"
                        >
                            Remove from Inventory
                        </button>
                    </div>
                    {selectedShift?.notes && (
                        <p className="mt-8 text-sm font-family-roboto">{selectedShift.notes}</p>
                    )}
                    <div className="flex flex-row gap-4 h-16 justify-center mt-auto">
                        <button
                            onClick={() => setScreen("shiftlist")}
                            className="mt-6 w-full border border-gray-300 rounded-sm"
                        >
                            Back
                        </button>
                    </div>
                </div>
            )}
            {screen === "modify" && (
                <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
                    <div className="flex justify-center pt-8">
                        <div className="flex flex-col items-center">
                            <h1 className="text-primary mb-4 font-bold text-2xl">
                                {summaryMode === "remove" ? "Remove from Inventory" : "Add to Inventory"}
                            </h1>
                            <VolunteerModifyStepOneIcon />
                        </div>
                    </div>

                    <button
                        onClick={() => setNotesOpen((o) => !o)}
                        className="flex items-center justify-between w-full mt-4"
                    >
                        <p className="text-primary font-bold">Shift Notes</p>
                        {notesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {notesOpen && <p className="mt-3">{selectedShift?.notes}</p>}
                    <p className="text-primary font-bold mt-4">{summaryMode === "remove" ? "Remove from Inventory" : "Add to Inventory"}</p>

                    {Object.keys(items).length > 0 && (
                        <div className="mt-4 space-y-2">
                            {Object.entries(items).map(([name, qty]) => (
                                <div key={name} className="flex justify-between items-center">
                                    <span className="font-bold">{name}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">{qty}</span>
                                        <button
                                            onClick={() => setItems((prev) => {
                                                const next = { ...prev };
                                                delete next[name];
                                                return next;
                                            })}
                                        >
                                            <X className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <button onClick={() => setOpen(true)} className="mt-4 bg-primary text-white w-24 h-8 rounded-sm">
                        Modify
                    </button>

                    <div className="flex flex-row gap-4 h-16 justify-center mt-auto ">
                        <button
                            onClick={() => setScreen("shiftoverview")}
                            className="mt-6 w-full border border-gray-300 rounded-sm"
                        >
                            Back
                        </button>

                        {Object.keys(items).length > 0 && (
                            <button
                                onClick={() => setScreen("summary")}
                                className="mt-6 w-full bg-primary text-white rounded-sm"
                            >
                                Next
                            </button>
                        )}
                    </div>
                    {open && createPortal(
                        <ItemSearch
                            categories={inventoryCategories}
                            isLoading={isLoading}
                            isError={isError}
                            onAdd={handleAddItem}
                            onClose={() => setOpen(false)}
                            mode={summaryMode}
                        />,
                        document.body
                    )}
                </div>
            )}

            {screen === "summary" && (
                <>
                    <h1 className="text-primary mb-4 font-bold text-2xl text-center pt-8">Summary</h1>

                    <div className="flex justify-center pb-4">
                        <VolunteerModifyStepTwoIcon />
                    </div>

                    <p className="font-family-roboto font-medium text-base text-primary">{summaryMode === "remove" ? "Remove from Inventory" : "Add to Inventory"}</p>

                    {Object.keys(items).length === 0 ? (
                        <p className="text-gray-400 mt-4">
                            No items selected
                        </p>
                    ) : (
                        <div className="space-y-3 mt-4">
                            {Object.entries(items).map(([name, qty]) => (
                                <div
                                    key={name}
                                    className="flex justify-between font-bold"
                                >
                                    <span>{name}</span>
                                    <span className="text-text-1 font-bold">
                                        {qty}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex flex-row gap-4 h-16 justify-center mt-auto ">
                        <button
                            onClick={() => setScreen("modify")}
                            className="mt-6 w-full border border-gray-300 rounded-sm"
                        >
                            Back
                        </button>

                        {Object.keys(items).length > 0 && (
                            <button
                                onClick={async () => { if (await handleConfirm()) { setItems({}); setScreen("shiftoverview"); } }}
                                className="mt-6 w-full bg-primary text-white rounded-sm"
                            >
                                Confirm
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}