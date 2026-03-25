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
            tb.tasks.length > 0 && "donor" in tb.tasks[0]
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
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Spinner className="size-6 text-primary" />
            </div>
        );
    }
    
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
        <div className="flex flex-col h-full">
            <div className="bg-white rounded-l px-6 py-1">
                {/* shift type + spots available dropdwon */}
                <div className="flex items-center gap-4 py-3 border-b border-gray-200">
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
                </div>

                {/* list view */}
                <div className="flex mt-4">
                    <ShiftListView
                        timeBlocks={filteredTimeBlocks}
                        currentUserID={user.uid}
                    />
                </div>
            </div>
        </div>
    );
}
