"use client";

import Link from "next/link";
import { CaretRightIcon } from "@phosphor-icons/react";
import { useTimeBlocks } from "@/lib/queries/timeblocks";
import { useAuth } from "@/contexts/AuthContext";
import { formatTime } from "@/lib/utils";
import { DogSitIcon } from "@/components/icons/DogSitIcon";

export default function ShiftTaskSummary() {
    const { allTB: timeblocks = [], isLoading } = useTimeBlocks();
    const { state } = useAuth();
    const userId = state.currentUser?.uid;

    const now = new Date();
    const todayMidnightMs = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    const upcomingShifts = timeblocks
        .filter((tb) => {
            if (!userId) return false;
            const shiftDate = tb.startTime.toDate();
            const shiftDayStart = new Date(shiftDate.getFullYear(), shiftDate.getMonth(), shiftDate.getDate()).getTime();
            return shiftDayStart >= todayMidnightMs && tb.volunteerGroups?.some((g) => g.volunterIDs?.includes(userId));
        })
        .sort((a, b) => a.startTime.toDate().getTime() - b.startTime.toDate().getTime());

    const earliestShift = upcomingShifts[0];
    const earliestDayStart = earliestShift
        ? new Date(earliestShift.startTime.toDate().getFullYear(), earliestShift.startTime.toDate().getMonth(), earliestShift.startTime.toDate().getDate()).getTime()
        : null;
    const shiftsToShow = earliestDayStart !== null
        ? upcomingShifts.filter((tb) => {
            const d = tb.startTime.toDate();
            return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() === earliestDayStart;
        })
        : [];

    if (isLoading) {
        return (
            <div className="h-24 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (shiftsToShow.length === 0) return (
        <div>
            <Link href="/volunteer-tasks">
                <div className="flex items-center mb-5 cursor-pointer gap-2">
                    <h2 className="text-2xl font-semibold text-gray-800 leading-none">Shift Tasks</h2>
                    <CaretRightIcon className="w-5 h-5" />
                </div>
            </Link>
            <div className="border bg-white overflow-hidden md:rounded flex flex-col items-center justify-center py-4 gap-2">
                <DogSitIcon/>
                <p className="text-sm font-medium">No upcoming shifts!</p>
            </div>
        </div>
    );

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
                {shiftsToShow.map((tb) => {
                    const start = tb.startTime.toDate();
                    const end = tb.endTime?.toDate();
                    const shiftDayStart = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
                    const isOpen = shiftDayStart === todayMidnightMs;
                    const timeRange = end ? `${formatTime(start)}-${formatTime(end)}` : formatTime(start);

                    return (
                        <div key={tb.id}>
                            {/* mobile */}
                            <div className="block md:hidden border-t border-gray-200">
                                <div className="px-4 pt-3 pb-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-full bg-primary text-white text-sm flex items-center justify-center font-semibold shrink-0">
                                                {start.getDate()}
                                            </div>
                                            <div className="text-sm font-medium text-gray-500">
                                                {`${start.toLocaleDateString("en-US", { month: "short" }).toUpperCase()}, ${start.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}`}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-text-1 shrink-0">
                                            <div className={`w-3 h-3 rounded-full shrink-0 ${tb.type === "Warehouse" ? "bg-[#FBCF0B]" : "bg-primary"}`} />
                                            {timeRange}
                                        </div>
                                    </div>
                                    <div className="flex items-start justify-between gap-4 pl-10">
                                        <div className="flex flex-col gap-1">
                                            <div className="text-sm text-text-1">{tb.name}</div>
                                            <div className="flex flex-col gap-1 text-sm text-primary">
                                                {tb.volunteerGroups?.map((group) => (
                                                    <div key={group.name}>
                                                        {group.volunterIDs?.length ?? 0}/{group.maxNum ?? 0}{" "}
                                                        {group.name}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="shrink-0">
                                            {isOpen ? (
                                                <Link href={`/volunteer-tasks?id=${tb.id}`} className="text-sm h-8 w-24 flex items-center justify-center rounded-xs bg-primary text-white">
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
                                <div className="py-3 px-4 flex gap-4 items-center">
                                    <div className="flex items-start gap-3 w-32 shrink-0">
                                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm shrink-0">
                                            {start.getDate()}
                                        </div>
                                        <div className="text-sm text-gray-500 font-medium mt-1.5">
                                            {`${start.toLocaleDateString("en-US", { month: "short" }).toUpperCase()}, ${start.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}`}
                                        </div>
                                    </div>
                                    <div className={`w-3 h-3 rounded-full shrink-0 ${tb.type === "Warehouse" ? "bg-[#FBCF0B]" : "bg-primary"}`} />
                                    <div className="w-24 shrink-0 text-sm text-text-1">{timeRange}</div>
                                    <div className="flex-1 min-w-0 text-sm font-semibold text-text-1 truncate">{tb.name}</div>
                                    <div className="flex flex-col gap-1 text-primary text-sm shrink-0">
                                        {tb.volunteerGroups?.map((group) => (
                                            <span key={group.name}>
                                                {group.volunterIDs?.length ?? 0}/{group.maxNum ?? 0} {group.name}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="ml-10 shrink-0">
                                        {isOpen ? (
                                            <Link href={`/volunteer-tasks?id=${tb.id}`} className="text-sm h-8 w-24 flex items-center justify-center rounded-xs bg-primary text-white">
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
                    );
                })}
            </div>
        </div>
    );
}
