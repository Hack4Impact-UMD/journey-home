"use client";

import { useState } from "react";
import ShiftListView from "@/components/schedule/ShiftListView";
import { useTimeBlocks } from "@/lib/queries/timeblocks";
import { useAuth } from "@/contexts/AuthContext";
import { DropdownMultiselect } from "@/components/inventory/DropdownMultiselect";
import { Spinner } from "@/components/ui/spinner";

export default function VolunteerSignupPage() {
    const {
        allTB: timeBlocks = [],
        isLoading,
        isError,
        error,
    } = useTimeBlocks();

    const { state } = useAuth();
    const user = state.currentUser;

    const [selectedTypes, setSelectedTypes] = useState<string[]>([
        "Warehouse",
        "Pickups / Deliveries",
    ]);

    const [selectedAvailability, setSelectedAvailability] = useState<string[]>([
        "Available",
        "Full",
    ]);

    const filteredTimeBlocks = timeBlocks.filter((tb) => {
        const type =
            tb.type === "Pickup/Delivery"
                ? "Pickups / Deliveries"
                : "Warehouse";

        const isAvailable = tb.volunteerGroups.some(
            (group) => group.volunterIDs.length < group.maxNum
        );

        const availability = isAvailable ? "Available" : "Full";

        return (
            selectedTypes.includes(type) &&
            selectedAvailability.includes(availability)
        );
    });

    if (!user) return null;

    if (isError) {
        return (
            <div className="flex justify-center items-center h-full">
                <span className="text-red-500 text-sm">
                    {error instanceof Error
                        ? error.message
                        : "Failed to load shifts"}
                </span>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col">
                <div className="flex gap-3 mt-2 mb-5 ml-4">
                    <DropdownMultiselect
                        label="Shift type"
                        options={["Warehouse", "Pickups / Deliveries"]}
                        selected={selectedTypes}
                        setSelected={setSelectedTypes}
                    />

                    <DropdownMultiselect
                        label="Spots available"
                        options={["Available", "Full"]}
                        selected={selectedAvailability}
                        setSelected={setSelectedAvailability}
                    />

                    {isLoading && (
                        <div className="flex items-center">
                            <Spinner className="size-5 text-primary" />
                        </div>
                    )}
                </div>

                <div className="border-b border-gray-200 w-full" />
            </div>

            {/* content */}
            <div className="flex-1 overflow-auto min-h-0">
                <ShiftListView
                    timeBlocks={filteredTimeBlocks}
                    currentUserID={user.uid}
                />
            </div>
        </>
    );
}
