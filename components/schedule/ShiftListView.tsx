"use client";

import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import { TimeBlock } from "@/types/schedule";
import ConfirmModal from "@/components/general/ConfirmModal";
import Button from "@/components/form/Button";
import { useTimeBlocks } from "@/lib/queries/timeblocks";

type TBWithTypes = TimeBlock & {
    volunteerTypes?: Record<string, "Lead driver" | "General volunteer">;
};

type Props = {
    timeBlocks: TimeBlock[];
    currentUserID: string;
};

export default function ShiftListView({ timeBlocks, currentUserID }: Props) {
    const [selectedTB, setSelectedTB] = useState<TimeBlock | null>(null);
    const [action, setAction] = useState<"signup" | "drop" | null>(null);
    const { setTimeblockToast } = useTimeBlocks();

    const [volunteerType, setVolunteerType] = useState<
        "Lead driver" | "General volunteer" | null
    >(null);

    // formatting time
    const formatTime = (timestamp: Timestamp) => {
        const date = timestamp.toDate();
        const hours = date.getHours();
        const hour12 = hours % 12 || 12;
        const suffix = hours >= 12 ? "pm" : "am";
        return `${hour12}${suffix}`;
    };

    // grouping list view by date
    const groupedByDate = timeBlocks.reduce((acc, tb) => {
        const dateKey = tb.startTime.toDate().toDateString();

        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(tb);

        return acc;
    }, {} as Record<string, TimeBlock[]>);

    return (
        <div className="w-full">
            {/* mobile view */}
            <div className="block md:hidden px-1 space-y-4 bg-white">
                {Object.entries(groupedByDate).map(([dateKey, blocks]) => {
                    const date = new Date(dateKey);

                    return (
                        <div key={dateKey} className="space-y-4">
                            {/* date header */}
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-full bg-primary text-white text-sm flex items-center justify-center font-semibold">
                                    {date.getDate()}
                                </div>

                                <div className="text-sm font-medium text-gray-500">
                                    {`${date
                                        .toLocaleDateString("en-US", {
                                            month: "short",
                                        })
                                        .toUpperCase()}, ${date
                                        .toLocaleDateString("en-US", {
                                            weekday: "short",
                                        })
                                        .toUpperCase()}`}
                                </div>
                            </div>

                            {/* shifts */}
                            {blocks.map((tb) => {
                                const tbWithTypes = tb as TBWithTypes;
                                const totalGeneralCapacity = tb.volunteerGroups
                                    .filter(
                                        (g) => g.name === "General volunteer"
                                    )
                                    .reduce((sum, g) => sum + g.maxNum, 0);

                                const timeRange = `${formatTime(
                                    tb.startTime
                                )}-${formatTime(tb.endTime)}`;

                                const isSignedUp = tb.volunteerGroups.some(
                                    (group) =>
                                        group.volunterIDs.includes(
                                            currentUserID
                                        )
                                );

                                const type =
                                    tb.tasks.length > 0 &&
                                    "donor" in tb.tasks[0]
                                        ? "Pickups / Deliveries"
                                        : "Warehouse";

                                const leadDrivers = Object.values(
                                    tbWithTypes.volunteerTypes || {}
                                ).filter(
                                    (type) => type === "Lead driver"
                                ).length;

                                const generalVolunteers = Object.values(
                                    tbWithTypes.volunteerTypes || {}
                                ).filter(
                                    (type) => type === "General volunteer"
                                ).length;

                                return (
                                    <div key={tb.id} className="pb-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex flex-col gap-1">
                                                <div className="text-sm text-gray-700">
                                                    {type}
                                                </div>

                                                <div className="text-primary text-xs">
                                                    <div>
                                                        {/* assuming there's only two lead drivers */}
                                                        {leadDrivers}/2 lead
                                                        drivers
                                                    </div>
                                                    <div>
                                                        {generalVolunteers}/
                                                        {totalGeneralCapacity}{" "}
                                                        general volunteers
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-2">
                                                {/* time */}
                                                <div className="flex items-center gap-2 text-xs">
                                                    <div
                                                        className={`w-3 h-3 rounded-full ${
                                                            type === "Warehouse"
                                                                ? "bg-yellow-400"
                                                                : "bg-teal-500"
                                                        }`}
                                                    />
                                                    {timeRange}
                                                </div>

                                                {/* button */}
                                                {isSignedUp ? (
                                                    <Button
                                                        className="px-1 py-1 text-xs"
                                                        onClick={() => {
                                                            setSelectedTB(tb);
                                                            setAction("drop");
                                                        }}
                                                    >
                                                        Drop shift
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        className="px-1 py-1 text-xs"
                                                        onClick={() => {
                                                            setVolunteerType(null);
                                                            setSelectedTB(tb);
                                                            setAction("signup");
                                                        }}
                                                    >
                                                        Sign up
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {/* volunteered */}
                                        {isSignedUp && (
                                            <div className="mt-3">
                                                <span className="block border py-1 text-xs text-primary text-center">
                                                    Volunteered
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* one divider per date */}
                            <div className="border-b border-gray-200 mt-2" />
                        </div>
                    );
                })}
            </div>
            <div className="hidden md:block mx-auto max-w-6xl px-4">
                {/* desktop view */}
                {Object.entries(groupedByDate).map(([dateKey, blocks]) => {
                    const date = new Date(dateKey);

                    return (
                        <div
                            key={dateKey}
                            className="border-b border-gray-200 py-3 flex gap-6"
                        >
                            {/* date */}
                            <div className="flex items-start gap-4 w-40 mt-2">
                                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                                    {date.getDate()}
                                </div>

                                <div className="text-sm text-gray-500 font-medium mt-2.5">
                                    {`${date
                                        .toLocaleDateString("en-US", {
                                            month: "short",
                                        })
                                        .toUpperCase()}, ${date
                                        .toLocaleDateString("en-US", {
                                            weekday: "short",
                                        })
                                        .toUpperCase()}`}
                                </div>
                            </div>

                            {/* shifts */}
                            <div className="flex flex-col gap-3 flex-1">
                                {blocks.map((tb) => {
                                    const tbWithTypes = tb as TBWithTypes;

                                    const totalGeneralCapacity =
                                        tb.volunteerGroups
                                            .filter(
                                                (g) =>
                                                    g.name ===
                                                    "General volunteer"
                                            )
                                            .reduce(
                                                (sum, g) => sum + g.maxNum,
                                                0
                                            );

                                    const timeRange = `${formatTime(
                                        tb.startTime
                                    )}-${formatTime(tb.endTime)}`;

                                    const isSignedUp = tb.volunteerGroups.some(
                                        (group) =>
                                            group.volunterIDs.includes(
                                                currentUserID
                                            )
                                    );

                                    const isFull = tb.volunteerGroups.every(
                                        (group) =>
                                            group.volunterIDs.length >=
                                            group.maxNum
                                    );

                                    const type =
                                        tb.tasks.length > 0 &&
                                        "donor" in tb.tasks[0]
                                            ? "Pickups / Deliveries"
                                            : "Warehouse";

                                    const leadDrivers = Object.values(
                                        tbWithTypes.volunteerTypes || {}
                                    ).filter(
                                        (type) => type === "Lead driver"
                                    ).length;

                                    const generalVolunteers = Object.values(
                                        tbWithTypes.volunteerTypes || {}
                                    ).filter(
                                        (type) => type === "General volunteer"
                                    ).length;

                                    return (
                                        <div
                                            key={tb.id}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-4">
                                                {/* time dots */}
                                                <div
                                                    className={`w-3 h-3 rounded-full ${
                                                        type === "Warehouse"
                                                            ? "bg-yellow-400"
                                                            : "bg-teal-500"
                                                    }`}
                                                />

                                                <div className="w-30 text-gray-700">
                                                    {timeRange}
                                                </div>

                                                <div className="w-36 text-gray-700">
                                                    {type}
                                                </div>

                                                {/* volunteets */}
                                                <div className="text-primary px-5">
                                                    <div className="flex flex-col text-primary text-sm">
                                                        <span>
                                                            {leadDrivers}/2 lead
                                                            drivers
                                                        </span>
                                                        <span>
                                                            {generalVolunteers}/
                                                            {
                                                                totalGeneralCapacity
                                                            }{" "}
                                                            general volunteers
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* volunteer label */}
                                                {isSignedUp && (
                                                    <span className="border px-3 py-1 text-sm text-primary rounded-md">
                                                        Volunteered
                                                    </span>
                                                )}
                                            </div>

                                            {/* drop shift or sign up button depending on if theyre signed up alr or not */}
                                            {isSignedUp ? (
                                                <Button
                                                    onClick={() => {
                                                        setSelectedTB(tb);
                                                        setAction("drop");
                                                    }}
                                                >
                                                    Drop shift
                                                </Button>
                                            ) : (
                                                <div className="flex justify-end">
                                                    <Button
                                                        onClick={() => {
                                                            if (isFull) return;

                                                            setVolunteerType(
                                                                null
                                                            );

                                                            setSelectedTB(tb);
                                                            setAction("signup");
                                                        }}
                                                        className="w-26"
                                                    >
                                                        Sign up
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* confirm sign up */}
            {selectedTB && action === "signup" && (
                <ConfirmModal
                    title="Confirm Sign Up"
                    confirmLabel="Sign up"
                    onCancel={() => {
                        setSelectedTB(null);
                        setAction(null);
                        setVolunteerType(null);
                    }}
                    onConfirm={() => {
                        if (!selectedTB || !volunteerType) return;

                        const updatedTB = {
                            ...selectedTB,

                            volunteerGroups: selectedTB.volunteerGroups.map(
                                (group) => {
                                    if (group.name === volunteerType) {
                                        return {
                                            ...group,
                                            volunterIDs:
                                                group.volunterIDs.includes(
                                                    currentUserID
                                                )
                                                    ? group.volunterIDs
                                                    : [
                                                          ...group.volunterIDs,
                                                          currentUserID,
                                                      ],
                                        };
                                    }
                                    return group;
                                }
                            ),
                            volunteerTypes: {
                                ...((selectedTB as TBWithTypes)
                                    .volunteerTypes || {}),
                                [currentUserID]: volunteerType,
                            },
                        };

                        setTimeblockToast(updatedTB);

                        setSelectedTB(null);
                        setAction(null);
                        setVolunteerType(null);
                    }}
                >
                    <div className="flex flex-col gap-3">
                        <p className="font-medium">Type of volunteer</p>

                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="volunteerType"
                                checked={volunteerType === "Lead driver"}
                                onChange={() => setVolunteerType("Lead driver")}
                            />
                            Lead driver
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="volunteerType"
                                checked={volunteerType === "General volunteer"}
                                onChange={() =>
                                    setVolunteerType("General volunteer")
                                }
                            />
                            General volunteer
                        </label>
                    </div>
                    <p className="mt-5">
                        Are you sure you are available this date?
                    </p>
                </ConfirmModal>
            )}

            {/* drop model */}
            {selectedTB && action === "drop" && (
                <ConfirmModal
                    title="Drop shift"
                    confirmLabel="Drop shift"
                    onCancel={() => {
                        setSelectedTB(null);
                        setAction(null);
                    }}
                    onConfirm={() => {
                        if (!selectedTB) return;

                        const updatedTB = {
                            ...selectedTB,

                            // remove from IDs
                            volunteerGroups: selectedTB.volunteerGroups.map(
                                (group) => ({
                                    ...group,
                                    volunterIDs: group.volunterIDs.filter(
                                        (id) => id !== currentUserID
                                    ),
                                })
                            ),

                            // remove from volunteerTypes too
                            volunteerTypes: Object.fromEntries(
                                Object.entries(
                                    (selectedTB as TBWithTypes)
                                        .volunteerTypes || {}
                                ).filter(([id]) => id !== currentUserID)
                            ),
                        };

                        setTimeblockToast(updatedTB);

                        setSelectedTB(null);
                        setAction(null);
                    }}
                >
                    <p>Are you sure you want to drop this shift?</p>
                </ConfirmModal>
            )}
        </div>
    );
}
