"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { useTimeBlocks } from "../../../lib/queries/timeblocks";
import { TimeBlock } from "../../../types/schedule";
import { TruckIcon, WarehouseIcon, EyeIcon, EyeSlashIcon, PlusIcon } from "@phosphor-icons/react";
import { ShiftEditModal, makeDefaultTimeBlock } from "@/components/schedule/ShiftEditModal";
import { DropdownMultiselect } from "@/components/inventory/DropdownMultiselect";
import { SearchBox } from "@/components/inventory/SearchBox";
import { AdminCalendarPeople } from "@/components/icons/AdminCalendarPeople";
import { AdminCalendarDriver } from "@/components/icons/AdminCalendarDriver";
import { ShiftDetailOverlay } from "@/components/schedule/ShiftDetailOverlay";

const SHIFT_OPTIONS = ["Warehouse", "Pickup/Delivery"] as const;
type ShiftType = (typeof SHIFT_OPTIONS)[number];

const type_dot_color: Record<TimeBlock["type"], string> = {
    "Pickup/Delivery": "bg-[#02AFC7]",
    "Warehouse": "bg-[#FBCF0B]",
};

function formatTime(ts: { toDate: () => Date }) {
    return ts
        .toDate()
        .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
        .replace(":00", "")
        .toLowerCase()
        .replaceAll(" ", "");
}

function getDriverStats(tb: TimeBlock) {
    const driverGroups = tb.volunteerGroups.filter(
        (g) => g.name.toLowerCase().includes("drive") && g.maxNum >= 1
    );
    const otherGroups = tb.volunteerGroups.filter(
        (g) => !g.name.toLowerCase().includes("drive")
    );
    const driverSigned = driverGroups.reduce((s, g) => s + (g.volunterIDs?.length ?? 0), 0);
    const driverMax = driverGroups.reduce((s, g) => s + g.maxNum, 0);
    const volSigned = otherGroups.reduce((s, g) => s + (g.volunterIDs?.length ?? 0), 0);
    const volMax = otherGroups.reduce((s, g) => s + g.maxNum, 0);
    return {
        driverSigned,
        driverMax,
        volSigned,
        volMax,
        lowDrive: driverMax > 0 && driverSigned < driverMax,
        lowVol: volMax > 0 && volSigned <= volMax / 2,
    };
}

export default function ListView() {
    const { allTB: blocks } = useTimeBlocks();
    const [selectedTypes, setSelectedTypes] = useState<ShiftType[]>([...SHIFT_OPTIONS]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedTimeBlock, setSelectedTimeBlock] = useState<TimeBlock | null>(null);
    const [editingTB, setEditingTB] = useState<TimeBlock | null>(null);
    const todayLineRef = useRef<HTMLDivElement>(null);

    const filteredBlocks = useMemo(() =>
        blocks.filter((tb) =>
            selectedTypes.includes(tb.type as ShiftType) &&
            tb.name.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        [blocks, selectedTypes, searchQuery]
    );

    const groupedEvents = useMemo(() => {
        const sorted = [...filteredBlocks].sort(
            (a, b) => a.startTime.toDate().getTime() - b.startTime.toDate().getTime()
        );
        const groups: { dateKey: string; date: Date; events: TimeBlock[] }[] = [];
        for (const tb of sorted) {
            const date = tb.startTime.toDate();
            const dateKey = date.toDateString();
            const existing = groups.find((g) => g.dateKey === dateKey);
            if (existing) existing.events.push(tb);
            else groups.push({ dateKey, date, events: [tb] });
        }
        return groups;
    }, [filteredBlocks]);

    useEffect(() => {
        todayLineRef.current?.scrollIntoView({ block: "center" });
    }, [groupedEvents]);

    const todayStart = useMemo(() => {
        const d = new Date(Date.now());
        d.setHours(0, 0, 0, 0);
        return d.getTime();
    }, []);

    return (
        <>
            <div className="mb-4 px-6 flex flex-wrap items-center gap-3">
                <SearchBox value={searchQuery} onChange={setSearchQuery} onSubmit={() => {}} />
                <DropdownMultiselect
                    label="Shift Type"
                    options={[...SHIFT_OPTIONS]}
                    selected={selectedTypes}
                    setSelected={setSelectedTypes}
                />
                <button
                    onClick={() => setEditingTB(makeDefaultTimeBlock())}
                    className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-sm cursor-pointer text-white text-sm bg-[#02AFC7]"
                >
                    <PlusIcon className="w-4 h-4" />
                    Add Shift
                </button>
            </div>

            <div className="flex-1 overflow-auto min-h-0 flex flex-col border-t border-gray-200">
                {groupedEvents.map(({ dateKey, date, events }, idx) => {
                    const isPast = date.getTime() < todayStart;
                    const nextDate = idx < groupedEvents.length - 1 ? groupedEvents[idx + 1].date : null;
                    const isLastPast = isPast && (nextDate === null || nextDate.getTime() >= todayStart);
                    return (
                    <div key={dateKey} ref={isLastPast ? todayLineRef : undefined} className={`flex flex-row border-b ${isLastPast ? "border-red-500" : "border-gray-200"}`}>
                        <div className="flex flex-col items-center justify-center text-center w-21 shrink-0 py-2 pl-6 pr-6">
                            <span className="font-semibold text-base text-[#6B7A99]">{date.getDate()}</span>
                            <span className="text-xs text-[#6B7A99]">
                                {date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}
                            </span>
                        </div>
                        <div className="border-l border-[#E3E3E3] my-4" />
                        <div className="flex flex-col flex-1 min-w-0">
                            {events.map((tb, i) => {
                                const { driverSigned, driverMax, volSigned, volMax, lowDrive, lowVol } = getDriverStats(tb);
                                return (
                                    <div key={tb.id}>
                                        {i > 0 && <div className="border-t border-dotted border-[#E3E3E3]" />}
                                        <div className={`cursor-pointer hover:bg-gray-50 ${i === 0 ? "pt-5.5" : "pt-2"} ${i === events.length - 1 ? "pb-5.5" : "pb-2"}`} onClick={() => setSelectedTimeBlock(tb)}>
                                            <div className="flex items-center pl-6 pr-6">
                                                <span className={`h-3.5 w-3.5 rounded-full shrink-0 mr-6 ${type_dot_color[tb.type]}`} />
                                                <span className="w-[12%] shrink-0 text-sm">{formatTime(tb.startTime)}-{formatTime(tb.endTime)}</span>
                                                <span className="w-[25%] shrink-0 text-sm font-bold truncate">{tb.name}</span>
                                                <span className="w-[20%] shrink-0 text-sm flex items-center gap-2">
                                                    {tb.type === "Pickup/Delivery" ? <TruckIcon className="w-5 h-5" /> : <WarehouseIcon className="w-5 h-5" />}
                                                    {tb.type}
                                                </span>
                                                <span className="w-[20%] shrink-0 flex items-center gap-2 text-sm">
                                                    {tb.published ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
                                                    {tb.published ? "Published" : "Unpublished"}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <span className={`flex text-sm items-center gap-1 w-16 ${lowVol ? "text-[#E16060]" : "text-[#000000]"}`}>
                                                        <AdminCalendarPeople fill={lowVol ? "#E16060" : "#000000"} />
                                                        {volSigned}/{volMax}
                                                    </span>
                                                    {driverMax > 0 && (
                                                        <span className={`flex text-sm items-center gap-1 w-16 ${lowDrive ? "text-[#E16060]" : "text-[#000000]"}`}>
                                                            <AdminCalendarDriver fill={lowDrive ? "#E16060" : "#000000"} />
                                                            {driverSigned}/{driverMax}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    );
                })}
            </div>

            {selectedTimeBlock && (
                <ShiftDetailOverlay
                    timeBlock={selectedTimeBlock}
                    onClose={() => setSelectedTimeBlock(null)}
                />
            )}

            <ShiftEditModal
                timeBlock={editingTB}
                onClose={() => setEditingTB(null)}
                onSaved={() => setEditingTB(null)}
            />
        </>
    );
}
