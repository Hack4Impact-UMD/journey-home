"use client";

import Link from "next/link";
import { useTimeBlocks } from "@/lib/queries/timeblocks";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import { TimeBlock } from "@/types/schedule";

export default function AvailableShiftsSummary() {
    const { allTB: timeblocks = [], isLoading } = useTimeBlocks();
    const { state } = useAuth();
    const userId = state.currentUser?.uid;

    const now = new Date();

    const availableShifts = timeblocks
        .filter((tb) => {
            if (!userId) return false;

            const startTime = tb.startTime.toDate();
            if (!(tb.published === true && startTime > now)) return false;

            const isSignedUp = tb.volunteerGroups?.some((group) =>
                group.volunterIDs?.includes(userId)
            );

            const hasOpenGroup = tb.volunteerGroups?.some((group) => {
                const filled = group.volunterIDs?.length ?? 0;
                const capacity = group.maxNum ?? 0;
                return filled < capacity;
            });

            return !isSignedUp && hasOpenGroup;
        })
        .sort((a, b) => a.startTime.toDate().getTime() - b.startTime.toDate().getTime())
        .slice(0, 2);

    const formatTime = (date: Date) => {
        const hours = date.getHours();
        const hour12 = hours % 12 || 12;
        const suffix = hours >= 12 ? "pm" : "am";
        return `${hour12}${suffix}`;
    };

    const groupedByDate = availableShifts.reduce((acc, tb) => {
        const dateKey = tb.startTime.toDate().toDateString();
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(tb);
        return acc;
    }, {} as Record<string, TimeBlock[]>);

    const sortedDateEntries = Object.entries(groupedByDate).sort(
        ([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
    );

    return (
        <div>
            <Link href="/volunteer-signup">
                <div className="flex items-center mb-4 cursor-pointer gap-2">
                    <h2 className="text-[20px] font-semibold text-gray-800 leading-none">
                        Sign-Up
                    </h2>
                    <ChevronRightIcon />
                </div>
            </Link>

            <div className="border bg-white overflow-hidden">
                {isLoading ? (
                    <div className="h-64" />
                ) :availableShifts.length === 0 ? (
                    <div className="h-64 flex items-center justify-center text-sm text-gray-400">
                        No shifts
                    </div>
                ) : (
                    <>
                        {/* mobile */}
                        <div className="block md:hidden border-t border-gray-200">
                            {sortedDateEntries.map(([dateKey, blocks]) => {
                                const date = new Date(dateKey);
                                return (
                                    <div key={dateKey}>
                                        <div className="px-4 space-y-3 pt-3 pb-3">
                                            {blocks.map((tb, index) => {
                                                const start = tb.startTime.toDate();
                                                const end = tb.endTime?.toDate();
                                                const isFull = !tb.volunteerGroups?.some((g) => (g.volunterIDs?.length ?? 0) < (g.maxNum ?? 0));
                                                const timeRange = end
                                                    ? `${formatTime(start)}-${formatTime(end)}`
                                                    : formatTime(start);
                                                const isFirst = index === 0;

                                                const typeDot = (
                                                    <div className={`w-3 h-3 rounded-full shrink-0 ${tb.type === "Warehouse" ? "bg-[#FBCF0B]" : "bg-primary"}`} />
                                                );

                                                const timeEl = (
                                                    <div className="flex items-center gap-2 text-sm text-text-1 shrink-0">
                                                        {typeDot}
                                                        {timeRange}
                                                    </div>
                                                );

                                                const button = isFull ? (
                                                    <div className="text-sm h-8 w-24 flex items-center justify-center shrink-0 rounded-xs bg-white text-gray-400 border border-gray-300">
                                                        Full
                                                    </div>
                                                ) : (
                                                    <Link href="/volunteer-signup" className="text-sm h-8 w-24 flex items-center justify-center shrink-0 rounded-xs bg-primary text-white">
                                                        Sign up
                                                    </Link>
                                                );

                                                return (
                                                    <div key={tb.id}>
                                                        {isFirst && (
                                                            <div className="flex items-center justify-between mb-2">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-7 h-7 rounded-full bg-primary text-white text-sm flex items-center justify-center font-semibold shrink-0">
                                                                        {date.getDate()}
                                                                    </div>
                                                                    <div className="text-sm font-medium text-gray-500">
                                                                        {`${date.toLocaleDateString("en-US", { month: "short" }).toUpperCase()}, ${date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}`}
                                                                    </div>
                                                                </div>
                                                                {timeEl}
                                                            </div>
                                                        )}
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
                                                            <div className="flex flex-col items-end gap-1 shrink-0">
                                                                {!isFirst && timeEl}
                                                                {button}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="border-b border-gray-200 mx-4" />
                                    </div>
                                );
                            })}
                        </div>

                        {/* desktop */}
                        <div className="hidden md:block w-full border-t border-gray-200">
                            {sortedDateEntries.map(([dateKey, blocks]) => {
                                const date = new Date(dateKey);
                                return (
                                    <div key={dateKey} className="border-b border-gray-200">
                                        <div className="py-3 px-4 flex gap-4 items-start">
                                            <div className="flex items-start gap-3 w-32">
                                                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm shrink-0">
                                                    {date.getDate()}
                                                </div>
                                                <div className="text-sm text-gray-500 font-medium mt-1.5">
                                                    {`${date.toLocaleDateString("en-US", { month: "short" }).toUpperCase()}, ${date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}`}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-3 flex-1">
                                                {blocks.map((tb) => {
                                                    const start = tb.startTime.toDate();
                                                    const end = tb.endTime?.toDate();
                                                    const isFull = !tb.volunteerGroups?.some((g) => (g.volunterIDs?.length ?? 0) < (g.maxNum ?? 0));
                                                    const timeRange = end
                                                        ? `${formatTime(start)}-${formatTime(end)}`
                                                        : formatTime(start);

                                                    return (
                                                        <div key={tb.id} className="flex items-center gap-4">
                                                            <div className={`w-3 h-3 rounded-full shrink-0 ${tb.type === "Warehouse" ? "bg-[#FBCF0B]" : "bg-primary"}`} />
                                                            <div className="w-24 shrink-0 text-sm text-text-1">{timeRange}</div>
                                                            <div className="w-40 shrink-0 text-sm text-text-1">{tb.name}</div>
                                                            <div className="flex flex-col gap-1 text-primary text-sm">
                                                                {tb.volunteerGroups?.map((group) => (
                                                                    <span key={group.name}>
                                                                        {group.volunterIDs?.length ?? 0}/{group.maxNum ?? 0} {group.name}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                            <div className="ml-auto shrink-0">
                                                                {isFull ? (
                                                                    <div className="text-sm h-8 w-24 flex items-center justify-center rounded-xs bg-white text-gray-400 border border-gray-300">
                                                                        Full
                                                                    </div>
                                                                ) : (
                                                                    <Link href="/volunteer-signup" className="text-sm h-8 w-24 flex items-center justify-center rounded-xs bg-primary text-white">
                                                                        Sign up
                                                                    </Link>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
