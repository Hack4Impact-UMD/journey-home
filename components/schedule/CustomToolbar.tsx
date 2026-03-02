import { useState } from "react";
import { ToolbarProps } from "react-big-calendar";
import { MyEvent } from "../../types/schedule";
import { AddShiftOverlay } from "./AddShiftOverlay";

export function CustomToolbar({ label, onNavigate, onView, view }: ToolbarProps<MyEvent, object>) {
    const [showOverlay, setShowOverlay] = useState(false);

    return (
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
                <button onClick={() => onNavigate("TODAY")} className="px-4 py-2 rounded border text-[#6B7A99]">
                    <span className={label.includes(new Date().getFullYear().toString()) ? "text-[#02AFC7]" : ""}>
                        Today
                    </span>
                </button>

                <div className="flex border rounded overflow-hidden">
                    <button onClick={() => onView("month")} className="px-4 py-2">
                        <span className={view === "month" ? "text-[#02AFC7]" : "text-[#6B7A99]"}>Month</span>
                    </button>
                    <button onClick={() => onView("week")} className="px-4 py-2 border-l">
                        <span className={view === "week" ? "text-[#02AFC7]" : "text-[#6B7A99]"}>Week</span>
                    </button>
                    <button onClick={() => onView("day")} className="px-4 py-2 border-l">
                        <span className={view === "day" ? "text-[#02AFC7]" : "text-[#6B7A99]"}>Day</span>
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button onClick={() => onNavigate("PREV")}>
                    <img src="/left-arrow.png" alt="prev" />
                </button>
                <span className="font-semibold text-lg text-[#6B7A99]">{label}</span>
                <button onClick={() => onNavigate("NEXT")}>
                    <img src="/right-arrow.png" alt="next" />
                </button>
            </div>

            <div className="relative">
                <button
                    className="px-4 py-2 rounded border cursor-pointer text-white"
                    style={{ backgroundColor: "#02AFC7" }}
                    onClick={() => setShowOverlay(v => !v)}
                >
                    + Add Shift
                </button>
                <AddShiftOverlay isOpen={showOverlay} onClose={() => setShowOverlay(false)} />
            </div>
        </div>
    );
}