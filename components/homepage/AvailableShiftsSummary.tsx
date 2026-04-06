"use client";

import Link from "next/link";
import { useTimeBlocks } from "@/lib/queries/timeblocks";

export default function AvailableShiftsSummary() {
    const { allTB: timeblocks = [] } = useTimeBlocks();

    const now = new Date();

    const availableShifts = timeblocks
        .filter((tb) => {
            const start = tb.startTime.toDate();
            return start > now;
        })
        .sort(
            (a, b) =>
                a.startTime.toDate().getTime() - b.startTime.toDate().getTime()
        )
        .slice(0, 3);

    return (
        <div>
            <Link href="/volunteer-signup">
                <div className="flex items-center justify-between mb-4 cursor-pointer">
                    <h2 className="text-lg text-gray-800">Sign-Up {">"}</h2>
                </div>
            </Link>
            {/* list */}
            <div className="flex flex-col">
                {availableShifts.map((tb) => {
                    const start = tb.startTime.toDate();

                    // total volunteers across all groups
                    const totalVolunteers = tb.volunteerGroups?.reduce(
                        (sum, g) => sum + g.volunterIDs.length,
                        0
                    ) ?? 0;
                    
                    const totalCapacity = tb.volunteerGroups?.reduce(
                        (sum, g) => sum + g.maxNum,
                        0
                    ) ?? 0;

                    // show the types
                    const displayType =
                        tb.type === "Pickup/Delivery"
                            ? "Pickups / Deliveries"
                            : "Warehouse";

                    return (
                        <div
                            key={tb.id}
                            className="border p-3 flex items-center justify-between bg-white"
                        >
                            {/* left */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                                    {start.getDate()}
                                </div>

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
                                        {displayType}
                                    </div>

                                    <div className="text-xs text-primary">
                                        {totalVolunteers}/{totalCapacity}{" "}
                                        volunteers
                                    </div>
                                </div>
                            </div>

                            {/* right */}
                            <div className="flex items-center gap-3">
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

                                {/* sign up button -> shift signup page */}
                                <Link href="/volunteer-signup">
                                    <button className="bg-primary text-white px-4 py-1 text-xs rounded-xs">
                                        Sign up
                                    </button>
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
