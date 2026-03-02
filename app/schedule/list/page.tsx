"use client";
import { useEffect, useState, useRef } from "react";
import moment from "moment";
import { fetchAllTB } from "../../../lib/services/timeblocks";
import { TimeBlock } from "../../../types/schedule";

const SHIFT_OPTIONS = ["All", "Warehouse", "Pickups / Deliveries"];

export default function ListView() {
    const [blocks, setBlocks] = useState<TimeBlock[]>([]);
    const [filterType, setFilterType] = useState<string>("All");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const load = async () => {
            const data = await fetchAllTB();
            setBlocks(data);
        };
        load();
    }, []);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const filteredBlocks = filterType === "All"
        ? blocks
        : blocks.filter((tb) => (tb.type ?? "Pickups / Deliveries") === filterType);

    const grouped = filteredBlocks.reduce((acc, tb) => {
        const dateKey = moment(tb.startTime.toDate()).format("YYYY-MM-DD");
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(tb);
        return acc;
    }, {} as Record<string, TimeBlock[]>);

    const sortedDates = Object.keys(grouped).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    return (
        <div className="bg-white rounded-xl p-6">
            {/* Shift Type Filter Button */}
            <div className="mb-4 relative inline-block" ref={dropdownRef}>
                <button
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-1.5 text-sm text-[#3D4B6B] bg-white hover:bg-gray-50 transition-colors"
                >
                    <span>{filterType === "All" ? "Shift Type" : filterType}</span>
                    <svg
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {dropdownOpen && (
                    <div className="absolute left-0 mt-1 w-52 bg-white border border-gray-200 rounded-md shadow-lg z-10 overflow-hidden">
                        {SHIFT_OPTIONS.map((option) => (
                            <button
                                key={option}
                                onClick={() => {
                                    setFilterType(option);
                                    setDropdownOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                                    filterType === option
                                        ? "text-[#02AFC7] font-semibold bg-cyan-50"
                                        : "text-[#3D4B6B]"
                                }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Orange timeline divider bar */}
            <div className="flex items-center mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500 flex-shrink-0" />
                <div className="flex-1 h-px bg-orange-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500 flex-shrink-0" />
            </div>

            {/* Date groups */}
            <div>
                {sortedDates.map((date, idx) => {
                    const day = moment(date);
                    return (
                        <div
                            key={date}
                            className={`py-4 ${idx < sortedDates.length - 1 ? "border-b border-gray-100" : ""}`}
                        >
                            <div className="flex items-start gap-5">
                                {/* Date circle */}
                                <div className="bg-[#02AFC7] text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold text-base flex-shrink-0">
                                    {day.format("D")}
                                </div>

                                {/* Month + Day */}
                                <div className="text-sm font-semibold text-[#02AFC7] uppercase pt-2.5 w-20 flex-shrink-0 tracking-wide">
                                    {day.format("MMM, ddd")}
                                </div>

                                {/* Shift rows */}
                                <div className="flex-1 space-y-1.5">
                                    {grouped[date].map((tb) => {
                                        const start = tb.startTime.toDate();
                                        const end = tb.endTime.toDate();
                                        const dotColor =
                                            tb.type === "Warehouse"
                                                ? "bg-yellow-400"
                                                : "bg-[#02AFC7]";

                                        return (
                                            <div
                                                key={tb.id}
                                                className="flex items-center gap-4 hover:bg-gray-50 px-2 py-1.5 rounded-lg cursor-pointer transition-colors"
                                            >
                                                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${dotColor}`} />
                                                <div className="text-sm text-[#3D4B6B] w-36 flex-shrink-0 whitespace-nowrap">
                                                    {moment(start).format("h:mma")}-{moment(end).format("h:mma")}
                                                </div>
                                                <div className="text-sm text-[#3D4B6B]">
                                                    {tb.type}
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
        </div>
    );
}