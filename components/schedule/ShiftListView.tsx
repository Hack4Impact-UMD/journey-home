"use client";

import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import { TimeBlock } from "@/types/schedule";
import ConfirmModal from "@/components/general/ConfirmModal";
import Button from "@/components/form/Button";
import { useTimeBlocks } from "@/lib/queries/timeblocks";

type Props = {
    timeBlocks: TimeBlock[];
    currentUserID: string;
};

export default function ShiftListView({ timeBlocks, currentUserID }: Props) {
    const [selectedTB, setSelectedTB] = useState<TimeBlock | null>(null);
    const [action, setAction] = useState<"signup" | "drop" | null>(null);
    const { setTimeblockToast } = useTimeBlocks();
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

    const formatTime = (timestamp: Timestamp) => {
        const date = timestamp.toDate();
        const hours = date.getHours();
        const hour12 = hours % 12 || 12;
        const suffix = hours >= 12 ? "pm" : "am";
        return `${hour12}${suffix}`;
    };

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
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-full bg-primary text-white text-sm flex items-center justify-center font-semibold">
                                    {date.getDate()}
                                </div>

                                <div className="text-sm font-medium text-gray-500">
                                    {`${date.toLocaleDateString("en-US", {
                                        month: "short",
                                    }).toUpperCase()}, ${date
                                        .toLocaleDateString("en-US", {
                                            weekday: "short",
                                        })
                                        .toUpperCase()}`}
                                </div>
                            </div>

                            {blocks.map((tb) => {
                                const timeRange = `${formatTime(
                                    tb.startTime
                                )}-${formatTime(tb.endTime)}`;

                                const isSignedUp = tb.volunteerGroups.some(
                                    (group) =>
                                        group.volunterIDs.includes(
                                            currentUserID
                                        )
                                );

                                const type = tb.type;

                                return (
                                    <div key={tb.id} className="pb-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex flex-col gap-1">
                                                <div className="text-sm text-gray-700">
                                                    {tb.name}
                                                </div>

                                                <div className="text-primary text-xs">
                                                    {tb.volunteerGroups.map(
                                                        (group) => (
                                                            <div key={group.name}>
                                                                {
                                                                    group
                                                                        .volunterIDs
                                                                        .length
                                                                }
                                                                /{group.maxNum}{" "}
                                                                {group.name}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-2">
                                                <div className="flex items-center gap-2 text-xs">
                                                    <div
                                                        className={`w-3 h-3 rounded-full ${
                                                            type === "Warehouse"
                                                                ? "bg-secondary"
                                                                : "bg-primary"
                                                        }`}
                                                    />
                                                    {timeRange}
                                                </div>

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
                                                            setSelectedTB(tb);
                                                            setAction("signup");
                                                            setSelectedGroup(null); 
                                                        }}
                                                    >
                                                        Sign up
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

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

                            <div className="border-b border-gray-200 mt-2" />
                        </div>
                    );
                })}
            </div>

            <div className="hidden md:block mx-auto max-w-6xl px-4">
                {Object.entries(groupedByDate).map(([dateKey, blocks]) => {
                    const date = new Date(dateKey);

                    return (
                        <div
                            key={dateKey}
                            className="border-b border-gray-200 py-3 flex gap-6"
                        >
                            <div className="flex items-start gap-4 w-40 mt-2">
                                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                                    {date.getDate()}
                                </div>

                                <div className="text-sm text-gray-500 font-medium mt-2.5">
                                    {`${date.toLocaleDateString("en-US", {
                                        month: "short",
                                    }).toUpperCase()}, ${date
                                        .toLocaleDateString("en-US", {
                                            weekday: "short",
                                        })
                                        .toUpperCase()}`}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 flex-1">
                                {blocks.map((tb) => {
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

                                    const type = tb.type;

                                    return (
                                        <div
                                            key={tb.id}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`w-3 h-3 rounded-full ${
                                                        type === "Warehouse"
                                                            ? "bg-secondary"
                                                            : "bg-primary"
                                                    }`}
                                                />

                                                <div className="w-30 text-gray-700">
                                                    {timeRange}
                                                </div>

                                                <div className="w-36 text-gray-700">
                                                    {tb.name}
                                                </div>

                                                <div className="text-primary px-5">
                                                    <div className="flex flex-col text-primary text-sm">
                                                        {tb.volunteerGroups.map(
                                                            (group) => (
                                                                <span key={group.name}>
                                                                    {group.volunterIDs.length}/{group.maxNum} {group.name}
                                                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                </div>

                                                {isSignedUp && (
                                                    <span className="border px-3 py-1 text-sm text-primary rounded-md">
                                                        Volunteered
                                                    </span>
                                                )}
                                            </div>

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
                                                            setSelectedTB(tb);
                                                            setAction("signup");
                                                            setSelectedGroup(null);
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
                    confirmLabel="Sign up"
                    onCancel={() => {
                        setSelectedTB(null);
                        setAction(null);
                        setSelectedGroup(null); 
                    }}
                    onConfirm={() => {
                        if (!selectedTB || !selectedGroup) return;

                        const updatedTB = {
                            ...selectedTB,
                            volunteerGroups:
                                selectedTB.volunteerGroups.map((group) => {
                                    if (group.name === selectedGroup) {
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
                                }),
                        };

                        setTimeblockToast(updatedTB);

                        setSelectedTB(null);
                        setAction(null);
                        setSelectedGroup(null); 
                    }}
                >
                    <div className="mt-2 flex flex-col gap-4">
                        <div>
                            <p className="font-medium text-gray-600 mb-2">
                                Type of volunteer
                            </p>

                            <div className="flex flex-col gap-2">
                                {selectedTB.volunteerGroups.map((group) => (
                                    <label
                                        key={group.name}
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name="volunteerGroup"
                                            value={group.name}
                                            checked={
                                                selectedGroup === group.name
                                            }
                                            onChange={() =>
                                                setSelectedGroup(group.name)
                                            }
                                        />
                                        {group.name}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <p className="text-sm text-gray-600">
                            Are you sure you are available for this shift?
                        </p>
                    </div>
                </ConfirmModal>
            )}

            {/* drop modal */}
            {selectedTB && action === "drop" && (
                <ConfirmModal
                    confirmLabel="Drop shift"
                    onCancel={() => {
                        setSelectedTB(null);
                        setAction(null);
                    }}
                    onConfirm={() => {
                        if (!selectedTB) return;

                        const updatedTB = {
                            ...selectedTB,
                            volunteerGroups:
                                selectedTB.volunteerGroups.map((group) => ({
                                    ...group,
                                    volunterIDs: group.volunterIDs.filter(
                                        (id) => id !== currentUserID
                                    ),
                                })),
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