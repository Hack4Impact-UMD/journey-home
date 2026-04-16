"use client";

import Link from "next/link";
import { useTimeBlocks } from "@/lib/queries/timeblocks";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";

export default function AvailableShiftsSummary() {
    const { allTB: timeblocks = [] } = useTimeBlocks();
    const { state } = useAuth();
    const userId = state.currentUser?.uid;

    const now = new Date();

    const availableShifts = timeblocks
        .filter((tb) => {
            if (!userId) return false;

            const startTime = tb.startTime.toDate();
            if (!(tb.published === true && startTime > now)) return false;

            // check if user already signed up in any group
            const isSignedUp = tb.volunteerGroups?.some((group) =>
                group.volunterIDs?.includes(userId)
            );

            // check if any group has space
            const hasOpenGroup = tb.volunteerGroups?.some((group) => {
                const filled = group.volunterIDs?.length ?? 0;
                const capacity = group.maxNum ?? 0;
                return filled < capacity;
            });

            return !isSignedUp && hasOpenGroup;
        })
        .sort(
            (a, b) =>
                a.startTime.toDate().getTime() - b.startTime.toDate().getTime()
        )
        .slice(0, 2); // limit to 2

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
                {availableShifts.map((tb, index) => {
                    const start = tb.startTime.toDate();

                    const totalFilled =
                        tb.volunteerGroups?.reduce(
                            (sum, g) => sum + (g.volunterIDs?.length ?? 0),
                            0
                        ) ?? 0;

                    const totalCapacity =
                        tb.volunteerGroups?.reduce(
                            (sum, g) => sum + (g.maxNum ?? 0),
                            0
                        ) ?? 0;

                    const isFull = totalFilled >= totalCapacity;

                    return (
                        <div
                            key={tb.id}
                            className={`p-4 flex items-start justify-between ${
                                index !== availableShifts.length - 1
                                    ? "border-b"
                                    : ""
                            }`}
                        >
                            {/* left */}
                            <div className="flex items-start">
                                <div className="w-7 h-7 mr-3 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-[14px] leading-[11.59px] tracking-[0px] font-[Roboto]">
                                    {start.getDate()}
                                </div>

                                <div>
                                <div className="text-gray-500 text-[14px] leading-[11.59px] font-semibold tracking-[0px] font-[Roboto] mb-2">
                                        {`${start.toLocaleDateString(
                                            undefined,
                                            { month: "short" }
                                        )}, ${start.toLocaleDateString(
                                            undefined,
                                            { weekday: "short" }
                                        )}`.toUpperCase()}
                                    </div>

                                    <div className="text-sm">{tb.type}</div>

                                    <div className="flex flex-col gap-1 mt-1">
                                        {tb.volunteerGroups?.map((group) => {
                                            const filled =
                                                group.volunterIDs?.length ?? 0;
                                            const capacity = group.maxNum ?? 0;

                                            return (
                                                <div
                                                    key={group.name}
                                                    className="text-xs text-primary"
                                                >
                                                    {filled}/{capacity}{" "}
                                                    {group.name.toLowerCase()}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* right */}
                            <div className="flex flex-col gap-2 ml-auto mr-6">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`w-3 h-3 rounded-full ${
                                            tb.type === "Warehouse"
                                                ? "bg-secondary"
                                                : "bg-primary"
                                        }`}
                                    />
                                    <div className="text-sm">
                                        {start.toLocaleTimeString([], {
                                            hour: "numeric",
                                            minute: "2-digit",
                                        })}
                                    </div>
                                </div>

                                <Link
                                    href="/volunteer-signup"
                                    className={`h-8 px-4 text-sm rounded-sm flex items-center justify-center ${
                                        isFull
                                            ? "bg-gray-200 text-gray-500"
                                            : "bg-primary text-white"
                                    }`}
                                >
                                    {isFull ? "Full" : "Sign up"}
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
