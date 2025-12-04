"use client";

import { useState, useEffect } from "react";
import { VolunteerTimeBlock } from "@/types/pickupsDeliveries";
import { getAllTimeBlocks } from "@/lib/services/volunteerTimeBlocks";
import { Timestamp } from "firebase/firestore";

interface SchedulingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSchedule: (blockId: string) => void;
}

interface GroupedTimeBlocks {
    [date: string]: VolunteerTimeBlock[];
}

export default function SchedulingModal({
    isOpen,
    onClose,
    onSchedule,
}: SchedulingModalProps) {
    const [timeBlocks, setTimeBlocks] = useState<VolunteerTimeBlock[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchTimeBlocks();
        }
    }, [isOpen]);

    const fetchTimeBlocks = async () => {
        try {
            setLoading(true);
            const blocks = await getAllTimeBlocks();
            const futureBlocks = blocks.filter(
                (block) => block.start.toDate() > new Date()
            );
            setTimeBlocks(futureBlocks);
        } catch (error) {
            console.error("Error fetching time blocks:", error);
        } finally {
            setLoading(false);
        }
    };

    const groupTimeBlocksByDate = (): GroupedTimeBlocks => {
        const grouped: GroupedTimeBlocks = {};

        timeBlocks.forEach((block) => {
            const date = block.start.toDate();
            const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
            const monthDay = date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
            const dateKey = `${dayName}|${monthDay}`;

            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(block);
        });

        Object.keys(grouped).forEach((dateKey) => {
            grouped[dateKey].sort(
                (a, b) => a.start.toMillis() - b.start.toMillis()
            );
        });

        return grouped;
    };

    const formatTimeRange = (start: Timestamp, end: Timestamp): string => {
        const startDate = start.toDate();
        const endDate = end.toDate();

        const formatTime = (date: Date) => {
            const hours = date.getHours();
            const ampm = hours >= 12 ? "pm" : "am";
            const displayHours = hours % 12 || 12;
            return `${displayHours}${ampm}`;
        };

        return `${formatTime(startDate)} -${formatTime(endDate)}`;
    };

    const handleSave = () => {
        if (selectedBlockId) {
            onSchedule(selectedBlockId);
            onClose();
        }
    };

    if (!isOpen) return null;

    const groupedBlocks = groupTimeBlocksByDate();

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.3)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-2xl w-full flex flex-col"
                style={{ 
                    fontFamily: "Roboto, sans-serif",
                    maxWidth: "500px",
                    maxHeight: "80vh"
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Scrollable content */}
                <div className="overflow-y-auto flex-1 p-8">
                    <h2 
                        className="mb-6" 
                        style={{ 
                            fontSize: "20px",
                            fontWeight: 500,
                            color: "#565656",
                            lineHeight: "23px"
                        }}
                    >
                        Available Times
                    </h2>

                    {loading ? (
                        <div className="text-center py-8" style={{ color: "#7D7D7D" }}>
                            Loading...
                        </div>
                    ) : Object.keys(groupedBlocks).length === 0 ? (
                        <div className="text-center py-8" style={{ color: "#7D7D7D" }}>
                            No available time slots
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {Object.entries(groupedBlocks).map(([dateKey, blocks]) => {
                                const [dayName, monthDay] = dateKey.split("|");
                                return (
                                    <div key={dateKey}>
                                        <div className="mb-3">
                                            <span 
                                                style={{ 
                                                    fontSize: "16px", 
                                                    fontWeight: 500,
                                                    color: "#565656" 
                                                }}
                                            >
                                                {dayName}
                                            </span>
                                            <span 
                                                className="ml-2" 
                                                style={{ 
                                                    fontSize: "12px", 
                                                    fontWeight: 400,
                                                    color: "#7D7D7D"
                                                }}
                                            >
                                                {monthDay}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {blocks.map((block) => (
                                                <button
                                                    key={block.id}
                                                    type="button"
                                                    onClick={() => setSelectedBlockId(block.id)}
                                                    className="transition-all"
                                                    style={{
                                                        padding: "8px 20px",
                                                        borderRadius: "8px",
                                                        border: "2px solid #02AFC7",
                                                        backgroundColor: selectedBlockId === block.id 
                                                            ? "#02AFC7" 
                                                            : "#FFFFFF",
                                                        color: selectedBlockId === block.id 
                                                            ? "#FFFFFF" 
                                                            : "#565656",
                                                        fontSize: "14px",
                                                        fontWeight: 400,
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    {formatTimeRange(block.start, block.end)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Fixed footer with Save button */}
                <div 
                    className="border-t flex justify-end p-4"
                    style={{ 
                        borderColor: "#E0E0E0",
                        backgroundColor: "#FFFFFF"
                    }}
                >
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={!selectedBlockId}
                        className="transition-all"
                        style={{
                            padding: "10px 24px",
                            borderRadius: "4px",
                            backgroundColor: "#FFFFFF",
                            color: selectedBlockId ? "#565656" : "#9E9E9E",
                            fontSize: "16px",
                            fontWeight: 400,
                            cursor: selectedBlockId ? "pointer" : "not-allowed",
                            border: "1px solid #CCCCCC",
                        }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}