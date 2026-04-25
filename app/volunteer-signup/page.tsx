"use client";

import { useState } from "react";
import ShiftListView from "@/components/schedule/ShiftListView";
import { useTimeBlocks } from "@/lib/queries/timeblocks";
import { useAuth } from "@/contexts/AuthContext";
import { DropdownMultiselect } from "@/components/inventory/DropdownMultiselect";
import { SearchBox } from "@/components/inventory/SearchBox";
import { Spinner } from "@/components/ui/spinner";

export default function VolunteerSignupPage() {
    const {
        allTB: timeBlocks = [],
        isLoading,
        isError,
        error,
        refetch,
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

    const [searchQuery, setSearchQuery] = useState("");

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const filteredTimeBlocks = timeBlocks.filter((tb) => {
        if (tb.startTime.toDate() < todayStart) return false;

        const type =
            tb.type === "Pickup/Delivery"
                ? "Pickups / Deliveries"
                : "Warehouse";

        const isAvailable = tb.volunteerGroups.some(
            (group) => group.volunterIDs.length < group.maxNum
        );

        const availability = isAvailable ? "Available" : "Full";

        const q = searchQuery.toLowerCase();
        const matchesSearch =
            !q ||
            tb.name.toLowerCase().includes(q) ||
            tb.volunteerGroups.some((group) =>
                group.name.toLowerCase().includes(q)
            );

        return (
            selectedTypes.includes(type) &&
            selectedAvailability.includes(availability) &&
            matchesSearch
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
            <div className="flex flex-col mb-6 px-6">
                <div className="flex flex-wrap gap-3">
                    <SearchBox
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onSubmit={() => refetch()}
                    />

                    <DropdownMultiselect
                        label="Type"
                        options={["Warehouse", "Pickups / Deliveries"]}
                        selected={selectedTypes}
                        setSelected={setSelectedTypes}
                    />

                    <DropdownMultiselect
                        label="Availability"
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
            </div>

            <div className="flex-1 overflow-auto min-h-0">
                <ShiftListView
                    timeBlocks={filteredTimeBlocks}
                    currentUserID={user.uid}
                />
            </div>
        </>
    );
}
