"use client";
import { useState } from "react";
import { View } from "react-big-calendar";
import { TimeBlock } from "../../../types/schedule";
import { useTimeBlocks } from "../../../lib/queries/timeblocks";
import { MasterCalendar } from "../../../components/schedule/MasterCalendar";
import { AddShiftOverlay } from "../../../components/schedule/AddShiftOverlay";
import { ShiftDetailOverlay } from "../../../components/schedule/ShiftDetailOverlay";
import '@/styles/globals.scss';

export default function CalendarPage() {
    const { allTB: timeblocks, refetch } = useTimeBlocks();
    const [view, setView] = useState<View>("week");
    const [date, setDate] = useState(new Date());
    const [selectedTimeBlock, setSelectedTimeBlock] = useState<TimeBlock | null>(null);
    const [showAddOverlay, setShowAddOverlay] = useState(false);

    const now = new Date();
    const todayHighlight =
        view === "week"
            ? (() => { const end = new Date(date); end.setDate(end.getDate() + 6); return now >= date && now <= end; })()
            : date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();

    return (
        <>
            {/* Toolbar */}
            <div className="grid grid-cols-3 items-center mb-4">
                <div className="flex items-center gap-3">
                    <button onClick={() => setDate(new Date())} className="px-4 py-1 rounded-full border border-[#F5F6F7] text-sm bg-white shadow-[0_1px_3px_rgba(38,51,77,0.06)]">
                        <span className={todayHighlight ? "text-[#02AFC7]" : "text-[#6B7A99]"}>Today</span>
                    </button>
                    <div className="flex border border-[#F5F6F7] rounded-full overflow-hidden bg-white shadow-[0_1px_3px_rgba(38,51,77,0.06)]">
                        <button onClick={() => setView("week")} className="px-4 py-1 text-sm">
                            <span className={view === "week" ? "text-[#02AFC7]" : "text-[#6B7A99]"}>Week</span>
                        </button>
                        <button onClick={() => setView("month")} className="px-4 py-1 text-sm border-l border-[#F5F6F7]">
                            <span className={view === "month" ? "text-[#02AFC7]" : "text-[#6B7A99]"}>Month</span>
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-4">
                    <button onClick={() => {
                        const d = new Date(date);
                        view === "week" ? d.setDate(d.getDate() - 7) : d.setMonth(d.getMonth() - 1);
                        setDate(d);
                    }}>
                        <img src="/left-arrow.png" alt="prev" />
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
                        view === "week" ? d.setDate(d.getDate() + 7) : d.setMonth(d.getMonth() + 1);
                        setDate(d);
                    }}>
                        <img src="/right-arrow.png" alt="next" />
                    </button>
                </div>

                <div className="flex justify-end relative">
                    <button
                        onClick={() => setShowAddOverlay(v => !v)}
                        className="px-4 py-1.5 rounded-full cursor-pointer text-white text-sm bg-[#02AFC7]"
                    >
                        + Add Shift
                    </button>
                    <AddShiftOverlay
                        isOpen={showAddOverlay}
                        onClose={() => setShowAddOverlay(false)}
                        onShiftCreated={refetch}
                    />
                </div>
            </div>

            <MasterCalendar
                timeblocks={timeblocks}
                view={view}
                date={date}
                onView={setView}
                onNavigate={setDate}
                onSelectEvent={setSelectedTimeBlock}
            />

            <ShiftDetailOverlay
                timeBlock={selectedTimeBlock}
                onClose={() => setSelectedTimeBlock(null)}
                onSaved={() => { refetch(); setSelectedTimeBlock(null); }}
            />
        </>
    );
}
