"use client";

import Link from "next/link";
import { CaretRightIcon } from "@phosphor-icons/react";
import { useTimeBlocks } from "@/lib/queries/timeblocks";
import { useAuth } from "@/contexts/AuthContext";
import { formatTime } from "@/lib/utils";

export default function ShiftTaskSummary() {
    const { allTB: timeblocks = [], isLoading } = useTimeBlocks();
    const { state } = useAuth();
    const userId = state.currentUser?.uid;

    const now = new Date();
    const nowMs = now.getTime();
    const todayMidnightMs = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const todayEndMs = todayMidnightMs + 86400000;

    const todayShifts = timeblocks.filter((tb) => {
        if (!userId) return false;
        const startMs = tb.startTime.toDate().getTime();
        if (startMs < todayMidnightMs || startMs >= todayEndMs) return false;
        return tb.volunteerGroups?.some((g) => g.volunterIDs?.includes(userId));
    });

    const activeShift = todayShifts.find((tb) => {
        const startMs = tb.startTime.toDate().getTime();
        const endMs = tb.endTime?.toDate().getTime() ?? (startMs + 3600000);
        return startMs <= nowMs && nowMs < endMs;
    });

    const selectedShift = activeShift ?? [...todayShifts].sort(
        (a, b) => a.startTime.toDate().getTime() - b.startTime.toDate().getTime()
    )[0];

    if (isLoading) {
        return (
            <div className="h-24 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (!selectedShift) return null;

    const start = selectedShift.startTime.toDate();
    const end = selectedShift.endTime?.toDate();
    const startMs = start.getTime();
    const endMs = end?.getTime() ?? (startMs + 3600000);
    const isActive = startMs <= nowMs && nowMs < endMs;
    const timeRange = end ? `${formatTime(start)}-${formatTime(end)}` : formatTime(start);
    const date = start;

    return (
        <div>
            <Link href="/volunteer-tasks">
                <div className="flex items-center mb-5 cursor-pointer gap-2">
                    <h2 className="text-2xl font-semibold text-gray-800 leading-none">
                        Shift Tasks
                    </h2>
                    <CaretRightIcon className="w-5 h-5" />
                </div>
            </Link>

            <div className="border bg-white overflow-hidden md:rounded">
                {/* mobile */}
                <div className="block md:hidden border-t border-gray-200">
                    <div className="px-4 pt-3 pb-3">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-full bg-primary text-white text-sm flex items-center justify-center font-semibold shrink-0">
                                    {date.getDate()}
                                </div>
                                <div className="text-sm font-medium text-gray-500">
                                    {`${date.toLocaleDateString("en-US", { month: "short" }).toUpperCase()}, ${date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}`}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-text-1 shrink-0">
                                <div className={`w-3 h-3 rounded-full shrink-0 ${selectedShift.type === "Warehouse" ? "bg-[#FBCF0B]" : "bg-primary"}`} />
                                {timeRange}
                            </div>
                        </div>
                        <div className="flex items-start justify-between gap-4 pl-10">
                            <div className="flex flex-col gap-1">
                                <div className="text-sm text-text-1">{selectedShift.name}</div>
                                <div className="flex flex-col gap-1 text-sm text-primary">
                                    {selectedShift.volunteerGroups?.map((group) => (
                                        <div key={group.name}>
                                            {group.volunterIDs?.length ?? 0}/{group.maxNum ?? 0}{" "}
                                            {group.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="shrink-0">
                                {isActive ? (
                                    <Link href={`/volunteer-tasks?id=${selectedShift.id}`} className="text-sm h-8 w-24 flex items-center justify-center rounded-xs bg-primary text-white">
                                        Open
                                    </Link>
                                ) : (
                                    <div className="text-sm h-8 w-24 flex items-center justify-center rounded-xs bg-white text-primary border border-gray-300">
                                        Upcoming
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* desktop */}
                <div className="hidden md:block w-full border-t border-gray-200">
                    <div className="border-b border-gray-200">
                        <div className="py-3 px-4 flex gap-4 items-center">
                            <div className="flex items-start gap-3 w-32 shrink-0">
                                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm shrink-0">
                                    {date.getDate()}
                                </div>
                                <div className="text-sm text-gray-500 font-medium mt-1.5">
                                    {`${date.toLocaleDateString("en-US", { month: "short" }).toUpperCase()}, ${date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}`}
                                </div>
                            </div>
                            <div className={`w-3 h-3 rounded-full shrink-0 ${selectedShift.type === "Warehouse" ? "bg-[#FBCF0B]" : "bg-primary"}`} />
                            <div className="w-24 shrink-0 text-sm text-text-1">{timeRange}</div>
                            <div className="flex-1 min-w-0 text-sm font-semibold text-text-1 truncate">{selectedShift.name}</div>
                            <div className="flex flex-col gap-1 text-primary text-sm shrink-0">
                                {selectedShift.volunteerGroups?.map((group) => (
                                    <span key={group.name}>
                                        {group.volunterIDs?.length ?? 0}/{group.maxNum ?? 0} {group.name}
                                    </span>
                                ))}
                            </div>
                            <div className="ml-10 shrink-0">
                                {isActive ? (
                                    <Link href={`/volunteer-tasks?id=${selectedShift.id}`} className="text-sm h-8 w-24 flex items-center justify-center rounded-xs bg-primary text-white">
                                        Open
                                    </Link>
                                ) : (
                                    <div className="text-sm h-8 w-24 flex items-center justify-center rounded-xs bg-white text-primary border border-gray-300">
                                        Upcoming
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
