"use client";

import Link from "next/link";
import { useTimeBlocks } from "@/lib/queries/timeblocks";
import { useAuth } from "@/contexts/AuthContext";

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

            // check if signedup
            const isSignedUp = tb.volunteerGroups?.some((group) =>
                group.volunterIDs?.includes(userId)
            );

            const totalVolunteers =
                tb.volunteerGroups?.reduce(
                    (sum, g) => sum + (g.volunterIDs?.length ?? 0),
                    0
                ) ?? 0;
            const totalCapacity =
                tb.volunteerGroups?.reduce(
                    (sum, g) => sum + (g.maxNum ?? 0),
                    0
                ) ?? 0;
            const hasCapacity = totalVolunteers < totalCapacity;

            return !isSignedUp && hasCapacity;
        })
        .sort(
            (a, b) =>
                a.startTime.toDate().getTime() - b.startTime.toDate().getTime()
        );

    return (
        <div>
            <Link href="/volunteer-signup">
                <div className="flex items-center justify-between mb-4 cursor-pointer">
                    <h2 className="text-lg text-gray-800">Sign-Up {">"}</h2>
                </div>
            </Link>

            <div className="border bg-white overflow-hidden">
                {availableShifts.map((tb, index) => {
                    const start = tb.startTime.toDate();

                    const totalVolunteers =
                        tb.volunteerGroups?.reduce(
                            (sum, g) => sum + (g.volunterIDs?.length ?? 0),
                            0
                        ) ?? 0;

                    const totalCapacity =
                        tb.volunteerGroups?.reduce(
                            (sum, g) => sum + (g.maxNum ?? 0),
                            0
                        ) ?? 0;

                    const displayType =
                        tb.type === "Pickup/Delivery"
                            ? "Pickups / Deliveries"
                            : "Warehouse";

                    return (
                        <div
                            key={tb.id}
                            className={`p-4 flex items-center justify-between ${
                                index !== availableShifts.length - 1
                                    ? "border-b"
                                    : ""
                            }`}
                        >
                            {/* left */}
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                                    {start.getDate()}
                                </div>

                                <div>
                                    <div className="text-sm text-gray-500">
                                        {`${start.toLocaleDateString(
                                            undefined,
                                            { month: "short" }
                                        )}, ${start.toLocaleDateString(
                                            undefined,
                                            { weekday: "short" }
                                        )}`.toUpperCase()}
                                    </div>

                                    <div className="text-sm">{displayType}</div>

                                    <div className="text-xs text-primary">
                                        {totalVolunteers}/{totalCapacity}{" "}
                                        volunteers
                                    </div>
                                </div>
                            </div>

                            {/* right */}
                            <div className="flex flex-col items-end gap-2 ml-auto">
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
                                    className="bg-primary text-white h-8 px-4 py-1 text-xs rounded-xs inline-flex items-center"
                                >
                                    Sign up
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
