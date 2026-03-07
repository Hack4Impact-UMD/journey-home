"use client";

import { useState, useEffect } from "react";
import { TimeBlock } from "../../types/schedule";
import { useTimeBlocks } from "../../lib/queries/timeblocks";
import { useAllActiveAccounts } from "../../lib/queries/users";
import { Timestamp } from "firebase/firestore";

interface Props {
    isOpen: boolean;
    timeBlock: TimeBlock;
    onClose: () => void;
    onSaved: () => void;
}

function toDateString(ts: Timestamp): string {
    return ts.toDate().toLocaleDateString("en-CA"); // YYYY-MM-DD
}

function toTimeString(ts: Timestamp): string {
    const d = ts.toDate();
    return d.toTimeString().slice(0, 5); // HH:MM
}

function buildTimestamp(dateStr: string, timeStr: string): Timestamp {
    return Timestamp.fromDate(new Date(`${dateStr}T${timeStr}`));
}

export function EditShiftOverlay({ isOpen, timeBlock, onClose, onSaved }: Props) {
    const { setTimeblockToast } = useTimeBlocks();
    const { allAccounts } = useAllActiveAccounts();

    const [date, setDate] = useState(toDateString(timeBlock.startTime));
    const [startTime, setStartTime] = useState(toTimeString(timeBlock.startTime));
    const [endTime, setEndTime] = useState(toTimeString(timeBlock.endTime));
    const [shiftType, setShiftType] = useState<"pickup" | "warehouse" | null>(
        // derive from tasks: if any task has "donor" key it's pickup/delivery, else warehouse
        timeBlock.tasks.length > 0
            ? timeBlock.tasks.some((t) => "donor" in t || "client" in t)
                ? "pickup"
                : "warehouse"
            : null
    );
    const [openToVolunteers, setOpenToVolunteers] = useState(timeBlock.maxVolunteers > 0);
    const [maxVolunteers, setMaxVolunteers] = useState(
        timeBlock.maxVolunteers > 0 ? String(timeBlock.maxVolunteers) : ""
    );
    const [error, setError] = useState("");

    // Re-sync if the timeBlock prop changes (e.g. user opens edit on a different shift)
    useEffect(() => {
        setDate(toDateString(timeBlock.startTime));
        setStartTime(toTimeString(timeBlock.startTime));
        setEndTime(toTimeString(timeBlock.endTime));
        setOpenToVolunteers(timeBlock.maxVolunteers > 0);
        setMaxVolunteers(timeBlock.maxVolunteers > 0 ? String(timeBlock.maxVolunteers) : "");
        setShiftType(
            timeBlock.tasks.length > 0
                ? timeBlock.tasks.some((t) => "donor" in t || "client" in t)
                    ? "pickup"
                    : "warehouse"
                : null
        );
    }, [timeBlock]);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!date || !startTime || !endTime || !shiftType || (openToVolunteers && !maxVolunteers)) {
            setError("Please fill in all required fields.");
            return;
        }
        setError("");

        const updated: TimeBlock = {
            ...timeBlock,
            startTime: buildTimestamp(date, startTime),
            endTime: buildTimestamp(date, endTime),
            maxVolunteers: openToVolunteers ? Number(maxVolunteers) : 0,
        };

        await setTimeblockToast(updated);
        onSaved();
        onClose();
    };

    const volunteers = allAccounts.filter((u) => timeBlock.volunteerIDs.includes(u.uid));

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            <div className="relative w-72 bg-gray-50 rounded-xl shadow-xl divide-y divide-gray-200 max-h-[90vh] overflow-y-auto">

                {/* Date */}
                <div className="p-4">
                    <p className="font-bold text-slate-700 mb-3">Date</p>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-sm"
                    />
                </div>

                {/* Time */}
                <div className="p-4">
                    <p className="font-bold text-slate-700 mb-3">Time</p>
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="text-xs text-slate-400">Start</label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-sm mt-1"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs text-slate-400">End</label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-sm mt-1"
                            />
                        </div>
                    </div>
                </div>

                {/* Shift type */}
                <div className="p-4">
                    <p className="font-bold text-slate-700 mb-3">Type of shift</p>
                    {(["pickup", "warehouse"] as const).map((type) => (
                        <label key={type} className="flex items-center gap-2 mb-2 cursor-pointer">
                            <input
                                type="radio"
                                name="editShiftType"
                                checked={shiftType === type}
                                onChange={() => setShiftType(type)}
                                className="accent-[#02AFC7]"
                            />
                            <span className="text-sm text-slate-700">
                                {type === "pickup" ? "Pickup/deliveries" : "Warehouse"}
                            </span>
                        </label>
                    ))}
                </div>

                {/* Volunteers */}
                <div className="p-4">
                    <p className="font-bold text-slate-700 mb-3">Volunteers</p>

                    <label className="flex items-center gap-2 mb-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={openToVolunteers}
                            onChange={(e) => setOpenToVolunteers(e.target.checked)}
                            className="accent-[#02AFC7]"
                        />
                        <span className="text-sm text-slate-700">Open to volunteers</span>
                    </label>

                    <label className="text-xs text-slate-400 block mb-1">No. of volunteers</label>
                    <input
                        type="number"
                        min={0}
                        value={maxVolunteers}
                        disabled={!openToVolunteers}
                        onChange={(e) => setMaxVolunteers(e.target.value)}
                        className="w-32 border border-gray-200 rounded-md px-2 py-1.5 text-sm disabled:opacity-40"
                    />

                    {/* Current assigned volunteers (read-only) */}
                    {volunteers.length > 0 && (
                        <div className="mt-3">
                            <p className="text-xs text-slate-400 mb-1">Assigned</p>
                            <ul className="space-y-1">
                                {volunteers.map((v) => (
                                    <li key={v.uid} className="text-sm text-slate-700">
                                        {v.firstName} {v.lastName}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
                </div>

                {/* Footer */}
                <div className="p-3 flex justify-end">
                    <button
                        onClick={handleSave}
                        className="bg-[#02AFC7] hover:bg-[#0299B0] text-white text-sm font-semibold px-5 py-2 rounded-md"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}