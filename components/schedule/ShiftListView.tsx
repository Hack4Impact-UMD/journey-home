"use client";

import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import { TimeBlock } from "@/types/schedule";
import { ConfirmModal } from "@/components/general/ConfirmModal";
import Button from "@/components/form/Button";
import { useTimeBlocks } from "@/lib/queries/timeblocks";
import { Check } from "lucide-react";
import { WarehouseIcon } from "@phosphor-icons/react";
import { PickupDeliveryIcon } from "@/components/icons/PickupDeliveryIcon";
import ShiftSignUpConfirm from "@/components/schedule/ShiftSignUpConfirm";

type Props = {
    timeBlocks: TimeBlock[];
    currentUserID: string;
    onSignUpClick?: () => void;
};

export default function ShiftListView({ timeBlocks, currentUserID, onSignUpClick }: Props) {
    const [selectedTB, setSelectedTB] = useState<TimeBlock | null>(null);
    const [action, setAction] = useState<"signup" | "drop" | null>(null);
    const { setTimeblockToast, signUpToast } = useTimeBlocks();
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

    const sortedBlocks = [...timeBlocks].sort(
        (a, b) => a.startTime.toMillis() - b.startTime.toMillis()
    );

    const groupedByDate = sortedBlocks.reduce((acc, tb) => {
        const dateKey = tb.startTime.toDate().toDateString();
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(tb);
        return acc;
    }, {} as Record<string, TimeBlock[]>);

    const sortedDateEntries = Object.entries(groupedByDate).sort(
        ([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
    );

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
                {sortedDateEntries.map(([dateKey, blocks]) => {
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

                                    const typeIcon = type === "Pickup/Delivery"
                                        ? <PickupDeliveryIcon />
                                        : <WarehouseIcon className="w-4 h-4 shrink-0" />;

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
                                                if (onSignUpClick) { onSignUpClick(); return; }
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

                                            <div className="flex items-start justify-between gap-4 pl-10">
                                                <div className="flex flex-col gap-1 flex-1 min-w-0">
                                                    <div className="text-sm font-semibold text-text-1">{tb.name || <span className="italic text-gray-400">Unnamed Shift</span>}</div>
                                                    <div className="flex items-center gap-2 text-sm text-text-1">
                                                        {typeIcon}
                                                        {type === "Pickup/Delivery" ? "Pickup/Delivery" : "Warehouse"}
                                                    </div>
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
                {sortedDateEntries.map(([dateKey, blocks]) => {
                    const date = new Date(dateKey);

                    return (
                        <div key={dateKey} className="border-b border-gray-200">
                            <div className="py-3 px-8 flex gap-5.5 items-start">
                            <div className="flex items-start gap-3 w-30">
                                <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                                    {date.getDate()}
                                </div>

                                <div className="text-sm text-gray-500 font-medium mt-2">
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
                                        <div key={tb.id} className="flex items-center">
                                            <div className="flex items-center gap-2 shrink-0">
                                                <div
                                                    className={`w-3 h-3 rounded-full shrink-0 ${
                                                        type === "Warehouse"
                                                            ? "bg-[#FBCF0B]"
                                                            : "bg-primary"
                                                    }`}
                                                />
                                                <div className="w-27.5 text-sm text-text-1">
                                                    {timeRange}
                                                </div>
                                            </div>

                                            <div className="ml-6 flex-1 min-w-16 text-sm font-semibold text-text-1 truncate">
                                                {tb.name || <span className="italic text-gray-400">Unnamed Shift</span>}
                                            </div>

                                            <div className="ml-10 w-33.25 shrink-0 flex items-center gap-2 text-sm text-text-1">
                                                {type === "Pickup/Delivery" ? (
                                                    <>
                                                        <PickupDeliveryIcon />
                                                        Pickup/Delivery
                                                    </>
                                                ) : (
                                                    <>
                                                        <WarehouseIcon className="w-5 h-5 shrink-0" />
                                                        Warehouse
                                                    </>
                                                )}
                                            </div>

                                            <div className="ml-9 shrink-0 flex flex-col gap-1 text-primary text-sm">
                                                {tb.volunteerGroups.map((group) => (
                                                    <span key={group.name}>
                                                        {group.volunterIDs.length}/{group.maxNum} {group.name}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="ml-10 flex items-center gap-3 shrink-0">
                                                {isSignedUp && (
                                                    <span className="flex items-center gap-1 text-sm text-primary">
                                                        <Check className="w-4 h-4" />
                                                        Signed Up
                                                    </span>
                                                )}

                                                {isSignedUp ? (
                                                    <Button
                                                        variant="secondary"
                                                        className="text-sm font-roboto h-8 py-0 w-24 rounded-xs flex items-center justify-center"
                                                        onClick={() => {
                                                            setSelectedTB(tb);
                                                            setAction("drop");
                                                        }}
                                                    >
                                                        Drop shift
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        className="text-sm font-roboto h-8 py-0 w-24 rounded-xs flex items-center justify-center"
                                                        onClick={() => {
                                                            if (onSignUpClick) { onSignUpClick(); return; }
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

                        signUpToast(selectedTB.id, selectedGroup, currentUserID);

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
