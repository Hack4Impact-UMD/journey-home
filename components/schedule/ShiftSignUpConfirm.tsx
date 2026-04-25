"use client";

import { createPortal } from "react-dom";
import { TimeBlock } from "@/types/schedule";
import Button from "@/components/form/Button";
import { Timestamp } from "firebase/firestore";
import { CalendarBlank, Clock, X } from "@phosphor-icons/react";

type Props = {
    timeBlock: TimeBlock;
    selectedGroup: string | null;
    onGroupSelect: (name: string) => void;
    onConfirm: () => void;
    onClose: () => void;
};

function formatTime(timestamp: Timestamp) {
    const date = timestamp.toDate();
    const hours = date.getHours();
    const hour12 = hours % 12 || 12;
    const suffix = hours >= 12 ? "pm" : "am";
    return `${hour12}${suffix}`;
}

function formatDate(timestamp: Timestamp) {
    return timestamp.toDate().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });
}

export default function ShiftSignUpConfirm({
    timeBlock,
    selectedGroup,
    onGroupSelect,
    onConfirm,
    onClose,
}: Props) {
    const timeRange = `${formatTime(timeBlock.startTime)}–${formatTime(timeBlock.endTime)}`;
    const dateStr = formatDate(timeBlock.startTime);

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
            onClick={onClose}
        >
            <div
                className="w-75 px-6 py-8 bg-white rounded-[0.625rem] shadow-lg flex flex-col gap-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                    <p className="text-base font-medium" style={{ color: "#565656" }}>
                        Confirm Sign Up
                    </p>
                    <button onClick={onClose} className="text-text-1 hover:opacity-60 transition-opacity">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="bg-muted border-l-2 border-primary rounded-r-md px-3 py-2.5 flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-text-1">{timeBlock.name}</span>
                    <div className="flex items-center gap-1.5 text-xs text-text-1">
                        <CalendarBlank className="w-3.5 h-3.5 text-primary shrink-0" />
                        {dateStr}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-text-1">
                        <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                        {timeRange}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <p className="text-sm text-text-1">
                        Confirm the role you are signing up for:
                    </p>

                    {timeBlock.volunteerGroups.map((group) => {
                        const isFull = group.volunterIDs.length >= group.maxNum;
                        const isSelected = selectedGroup === group.name;
                        const displayCount = group.volunterIDs.length + (isSelected ? 1 : 0);
                        return (
                            <label
                                key={group.name}
                                className={`flex items-center gap-2 text-sm text-text-1 ${isFull ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                            >
                                <input
                                    type="radio"
                                    name="volunteerGroup"
                                    value={group.name}
                                    disabled={isFull}
                                    checked={isSelected}
                                    onChange={() => onGroupSelect(group.name)}
                                />
                                {group.name} ({displayCount}/{group.maxNum})
                            </label>
                        );
                    })}
                </div>

                <Button
                    className="w-full py-1 rounded-sm text-sm mt-2"
                    disabled={!selectedGroup}
                    onClick={onConfirm}
                >
                    Confirm
                </Button>
            </div>
        </div>,
        document.body
    );
}
