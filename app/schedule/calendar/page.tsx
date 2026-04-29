"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PlusIcon } from "@phosphor-icons/react";
import { View } from "react-big-calendar";
import { TimeBlock } from "../../../types/schedule";
import { useTimeBlocks } from "../../../lib/queries/timeblocks";
import { MasterCalendar } from "../../../components/schedule/MasterCalendar";
import { ShiftEditModal, makeDefaultTimeBlock } from "../../../components/schedule/ShiftEditModal";
import { ShiftDetailOverlay } from "../../../components/schedule/ShiftDetailOverlay";
import '@/styles/globals.scss';

export default function CalendarPage() {
    const { allTB: timeblocks } = useTimeBlocks();
    const [view, setView] = useState<View>("week");
    const [date, setDate] = useState(new Date());
    const [selectedTimeBlock, setSelectedTimeBlock] = useState<TimeBlock | null>(null);
    const [editingTB, setEditingTB] = useState<TimeBlock | null>(null);

    const now = new Date();
    const todayHighlight =
        view === "week"
            ? (() => {
                const weekStart = new Date(date);
                weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                weekStart.setHours(0, 0, 0, 0);
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 6);
                weekEnd.setHours(23, 59, 59, 999);
                return now >= weekStart && now <= weekEnd;
              })()
            : date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();

    return (
        <>
            {/* Toolbar */}
            <div className="grid grid-cols-3 items-center mb-4 px-6">
                <div className="flex items-center gap-3">
                    <button onClick={() => setDate(new Date())} className="px-4 py-1 rounded-full border border-light-border text-sm bg-white shadow-[0_1px_3px_rgba(38,51,77,0.06)]">
                        <span className={todayHighlight ? "text-[#02AFC7]" : "text-[#6B7A99]"}>Today</span>
                    </button>
                    <div className="flex border border-light-border rounded-full overflow-hidden bg-white shadow-[0_1px_3px_rgba(38,51,77,0.06)]">
                        <button onClick={() => setView("week")} className="px-4 py-1 text-sm">
                            <span className={view === "week" ? "text-[#02AFC7]" : "text-[#6B7A99]"}>Week</span>
                        </button>
                        <button onClick={() => setView("month")} className="px-4 py-1 text-sm border-l border-light-border">
                            <span className={view === "month" ? "text-[#02AFC7]" : "text-[#6B7A99]"}>Month</span>
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-4">
                    <button onClick={() => {
                        const d = new Date(date);
                        if (view === "week") d.setDate(d.getDate() - 7); else d.setMonth(d.getMonth() - 1);
                        setDate(d);
                    }} className="flex items-center justify-center w-7 h-7 rounded-full border border-light-border bg-white shadow-[0_1px_3px_rgba(38,51,77,0.06)]">
                        <ChevronLeft className="w-4 h-4 text-[#6B7A99]" />
                    </button>
                    <span className="font-semibold text-lg text-[#6B7A99] w-56 text-center">
                        {view === "week"
                            ? (() => {
                                const start = new Date(date);
                                start.setDate(start.getDate() - start.getDay());
                                const end = new Date(start);
                                end.setDate(end.getDate() + 6);
                                return start.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                                    + " – "
                                    + end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                              })()
                            : date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
                        }
                    </span>
                    <button onClick={() => {
                        const d = new Date(date);
                        if (view === "week") d.setDate(d.getDate() + 7); else d.setMonth(d.getMonth() + 1);
                        setDate(d);
                    }} className="flex items-center justify-center w-7 h-7 rounded-full border border-light-border bg-white shadow-[0_1px_3px_rgba(38,51,77,0.06)]">
                        <ChevronRight className="w-4 h-4 text-[#6B7A99]" />
                    </button>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={() => setEditingTB(makeDefaultTimeBlock())}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-sm cursor-pointer text-white text-sm bg-[#02AFC7]"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Add Shift
                    </button>
                </div>
            </div>

            <MasterCalendar
                timeblocks={timeblocks}
                view={view}
                date={date}
                onView={setView}
                onNavigate={setDate}
                onSelectEvent={setSelectedTimeBlock}
                onSelectSlot={(start) => setEditingTB(makeDefaultTimeBlock(start))}
            />

            <ShiftDetailOverlay
                timeBlock={selectedTimeBlock}
                onClose={() => setSelectedTimeBlock(null)}
            />

            <ShiftEditModal
                timeBlock={editingTB}
                onClose={() => setEditingTB(null)}
                onSaved={() => setEditingTB(null)}
            />
        </>
    );
}
