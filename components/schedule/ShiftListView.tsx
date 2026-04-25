"use client";

import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import { TimeBlock } from "@/types/schedule";
import { ConfirmModal } from "@/components/general/ConfirmModal";
import Button from "@/components/form/Button";
import { useTimeBlocks } from "@/lib/queries/timeblocks";
import { Check } from "lucide-react";
import ShiftSignUpConfirm from "@/components/schedule/ShiftSignUpConfirm";

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

    const formatDate = (timestamp: Timestamp) =>
        timestamp.toDate().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });

    const formatTimeRange = (start: Timestamp, end: Timestamp) =>
        `${formatTime(start)}–${formatTime(end)}`;

    const groupedByDate = timeBlocks.reduce((acc, tb) => {
        const dateKey = tb.startTime.toDate().toDateString();
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(tb);
        return acc;
    }, {} as Record<string, TimeBlock[]>);

    return (
        <div className="w-full">
            {timeBlocks.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-sm text-gray-400">
                    No shifts found
                </div>
            ) : (
            <>
            {/* mobile view */}
            <div className="block md:hidden border-t border-gray-200">
                {Object.entries(groupedByDate).map(([dateKey, blocks]) => {
                    const date = new Date(dateKey);

                    return (
                        <div key={dateKey}>
                            <div className="px-6 space-y-4 pt-4 pb-4">
                                {blocks.map((tb, index) => {
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
                                    const isFirst = index === 0;

                                    const typeDot = (
                                        <div
                                            className={`w-3 h-3 rounded-full shrink-0 ${
                                                type === "Warehouse"
                                                    ? "bg-[#FBCF0B]"
                                                    : "bg-primary"
                                            }`}
                                        />
                                    );

                                    const timeEl = (
                                        <div className="flex items-center gap-2 text-sm text-text-1 shrink-0">
                                            {typeDot}
                                            {timeRange}
                                        </div>
                                    );

                                    const button = isSignedUp ? (
                                        <Button
                                            variant="secondary"
                                            className="text-sm w-22 h-8 py-0 flex items-center justify-center shrink-0 rounded-xs"
                                            onClick={() => {
                                                setSelectedTB(tb);
                                                setAction("drop");
                                            }}
                                        >
                                            Drop
                                        </Button>
                                    ) : (
                                        <Button
                                            className="text-sm w-22 h-8 py-0 flex items-center justify-center shrink-0 rounded-xs"
                                            onClick={() => {
                                                setSelectedTB(tb);
                                                setAction("signup");
                                                setSelectedGroup(null);
                                            }}
                                        >
                                            Sign up
                                        </Button>
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

                                            <div className="flex items-start justify-between gap-4 pl-[2.5rem]">
                                                <div className="flex flex-col gap-1">
                                                    <div className="text-sm text-text-1">{tb.name}</div>
                                                    <div className="flex flex-col gap-1 text-sm text-primary">
                                                        {tb.volunteerGroups.map((group) => (
                                                            <div key={group.name}>
                                                                {group.volunterIDs.length}/{group.maxNum}{" "}
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

                                            {isSignedUp && (
                                                <div className="mt-2">
                                                    <span className="block border py-1 text-sm text-primary text-center">
                                                        Signed Up
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="border-b border-gray-200 mx-6" />
                        </div>
                    );
                })}
            </div>

            <div className="hidden md:block w-full border-t border-gray-200">
                {Object.entries(groupedByDate).map(([dateKey, blocks]) => {
                    const date = new Date(dateKey);

                    return (
                        <div key={dateKey} className="border-b border-gray-200">
                            <div className="py-3 px-8 flex gap-6 items-start">
                            <div className="flex items-start gap-4 w-40">
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

                            <div className="flex flex-col gap-4 flex-1">
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
                                        <div
                                            key={tb.id}
                                            className="flex items-center gap-4"
                                        >
                                            <div
                                                className={`w-3 h-3 rounded-full shrink-0 ${
                                                    type === "Warehouse"
                                                        ? "bg-[#FBCF0B]"
                                                        : "bg-primary"
                                                }`}
                                            />

                                            <div className="w-28 shrink-0 text-sm text-text-1">
                                                {timeRange}
                                            </div>

                                            <div className="w-64 shrink-0 text-sm text-text-1">
                                                {tb.name}
                                            </div>

                                            <div className="flex flex-col gap-1 text-primary text-sm">
                                                {tb.volunteerGroups.map((group) => (
                                                    <span key={group.name}>
                                                        {group.volunterIDs.length}/{group.maxNum} {group.name}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="ml-auto flex items-center gap-3 shrink-0">
                                                {isSignedUp && (
                                                    <span className="flex items-center gap-1 text-sm text-primary">
                                                        <Check className="w-4 h-4" />
                                                        Signed Up
                                                    </span>
                                                )}

                                                {isSignedUp ? (
                                                    <Button
                                                        variant="secondary"
                                                        className="text-sm font-roboto h-8 py-0 px-4 rounded-xs flex items-center"
                                                        onClick={() => {
                                                            setSelectedTB(tb);
                                                            setAction("drop");
                                                        }}
                                                    >
                                                        Drop shift
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        className="text-sm font-roboto h-8 py-0 px-4 rounded-xs flex items-center"
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

            {/* confirm sign up */}
            {selectedTB && action === "signup" && (
                <ShiftSignUpConfirm
                    timeBlock={selectedTB}
                    selectedGroup={selectedGroup}
                    onGroupSelect={setSelectedGroup}
                    onClose={() => {
                        setSelectedTB(null);
                        setAction(null);
                        setSelectedGroup(null);
                    }}
                    onConfirm={() => {
                        if (!selectedTB || !selectedGroup) return;

                        const targetGroup = selectedTB.volunteerGroups.find(
                            (group) => group.name === selectedGroup
                        );

                        if (!targetGroup) return;
                        if (targetGroup.volunterIDs.length >= targetGroup.maxNum) return;

                        const updatedTB = {
                            ...selectedTB,
                            volunteerGroups: selectedTB.volunteerGroups.map((group) => {
                                if (group.name === selectedGroup) {
                                    return {
                                        ...group,
                                        volunterIDs: group.volunterIDs.includes(currentUserID)
                                            ? group.volunterIDs
                                            : [...group.volunterIDs, currentUserID],
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
                />
            )}

            {/* drop modal */}
            {selectedTB && action === "drop" && (
                <ConfirmModal
                    title="Drop Shift"
                    message={`Are you sure you want to drop the ${selectedTB.name} shift (${formatDate(selectedTB.startTime)} ${formatTimeRange(selectedTB.startTime, selectedTB.endTime)})?`}
                    onCancel={() => {
                        setSelectedTB(null);
                        setAction(null);
                    }}
                    onConfirm={() => {
                        const updatedTB = {
                            ...selectedTB,
                            volunteerGroups: selectedTB.volunteerGroups.map((group) => ({
                                ...group,
                                volunterIDs: group.volunterIDs.filter((id) => id !== currentUserID),
                            })),
                        };

                        setTimeblockToast(updatedTB);

                        setSelectedTB(null);
                        setAction(null);
                    }}
                />
            )}
        </div>
    );
}
