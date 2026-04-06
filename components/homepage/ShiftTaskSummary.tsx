"use client";

import Link from "next/link";
import { useTimeBlocks } from "@/lib/queries/timeblocks";
import { useAuth } from "@/contexts/AuthContext";

export default function ShiftTaskSummary() {
    const { allTB: timeblocks = [] } = useTimeBlocks();
    const { state } = useAuth();
    const userId = state.currentUser?.uid;

    const now = new Date(); // to filter out past shifts

    const myShifts = timeblocks
        .filter((tb) => {
            if (!userId) return false;

            // const isSignedUp = tb.volunteerGroups?.some((group) =>
            //     group.volunterIDs?.includes(userId)
            // );
            console.log("USER ID:", userId);
            console.log("GROUPS:", tb.volunteerGroups);

            // shows the shift user is in and the future ones
            const start = tb.startTime.toDate();
            return start > now;
        })
        .sort(
            (a, b) =>
                a.startTime.toDate().getTime() - b.startTime.toDate().getTime()
        )
        .slice(0, 2); // shows only two shifts
    console.log("myShift:", myShifts);

    return (
        <div>
            {/* link to shift task page */}
            <Link href="/volunteer-tasks">
                <div className="flex items-center justify-between mb-4 cursor-pointer">
                    <h2 className="text-lg text-gray-800">Shift Tasks {">"}</h2>
                </div>
            </Link>
            <div className="flex flex-col">
                {myShifts.map((tb) => {
                    const start = tb.startTime.toDate();

                    const isToday =
                        start.toDateString() === new Date().toDateString();

                    const totalVolunteers = tb.volunteerGroups.reduce(
                        (sum, g) => sum + g.volunterIDs.length,
                        0
                    );

                    const totalCapacity = tb.volunteerGroups.reduce(
                        (sum, g) => sum + g.maxNum,
                        0
                    );

                    return (
                        <div
                            key={tb.id}
                            className="border p-3 flex items-center justify-between bg-white"
                        >
                            {/* left side (date + type of volunteer) */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                                    {start.getDate()}
                                </div>

                                {/* shift details  */}
                                <div>
                                    <div className="text-sm text-gray-500 font-semibold">
                                        {`${start.toLocaleDateString(
                                            undefined,
                                            { month: "short" }
                                        )}, ${start.toLocaleDateString(
                                            undefined,
                                            { weekday: "short" }
                                        )}`.toUpperCase()}
                                    </div>

                                    <div className="text-sm font-medium">
                                        {tb.type}
                                    </div>

                                    <div className="text-xs text-primary">
                                        {totalVolunteers}/{totalCapacity}{" "}
                                        volunteers
                                    </div>
                                </div>
                            </div>

                            {/* right side  */}
                            <div className="flex items-center gap-3">
                                <div className="text-sm">
                                    {start.toLocaleTimeString([], {
                                        hour: "numeric",
                                        minute: "2-digit",
                                    })}
                                </div>

                                {/* if the shift is today, show the open button, then lead to the shift task page */}
                                {isToday ? (
                                    <Link href="/volunteer-tasks">
                                        <button className="bg-primary text-white px-4 py-1 rounded-md text-sm">
                                            Open
                                        </button>
                                    </Link>
                                ) : (
                                    // show upcoming label if not today
                                    <div className="border px-4 py-1 text-xs rounded-xs text-primary">
                                        Upcoming
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
