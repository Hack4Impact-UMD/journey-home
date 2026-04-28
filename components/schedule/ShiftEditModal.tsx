"use client";

import { createPortal } from "react-dom";
import { useState, useEffect, useRef } from "react";
import { Timestamp } from "firebase/firestore";
import { Clock } from "lucide-react";
import { XIcon, PencilSimpleIcon, WarehouseIcon, UsersIcon, XCircleIcon, PlusIcon, TextAlignLeftIcon } from "@phosphor-icons/react";
import { TimeBlock, VolunteerGroup } from "../../types/schedule";
import { useTimeBlocks } from "../../lib/queries/timeblocks";
import { Switch } from "../ui/switch";

export function makeDefaultTimeBlock(slotStart?: Date): TimeBlock {
    let startDate: Date;
    let endDate: Date;

    if (slotStart) {
        startDate = new Date(slotStart);
        if (startDate.getHours() === 0 && startDate.getMinutes() === 0) {
            startDate.setHours(9, 0, 0, 0);
        } else {
            startDate.setMinutes(Math.floor(startDate.getMinutes() / 30) * 30, 0, 0);
        }
        endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + 3);
    } else {
        const today = new Date().toLocaleDateString("en-CA");
        const [year, month, day] = today.split("-").map(Number);
        startDate = new Date(year, month - 1, day, 9, 0, 0);
        endDate = new Date(year, month - 1, day, 17, 0, 0);
    }

    return {
        id: crypto.randomUUID(),
        name: "",
        type: "Warehouse",
        notes: "",
        startTime: Timestamp.fromDate(startDate),
        endTime: Timestamp.fromDate(endDate),
        volunteerGroups: [{ name: "General Volunteers", maxNum: 5, volunterIDs: [] }],
        tasks: [],
        published: false,
    };
}

function toDateString(ts: Timestamp): string {
    return ts.toDate().toLocaleDateString("en-CA");
}

function toTimeString(ts: Timestamp): string {
    return ts.toDate().toTimeString().slice(0, 5);
}

function formatDisplayDate(dateStr: string): string {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric",
    });
}

function addMinutes(timeStr: string, mins: number): string {
    const [h, m] = timeStr.split(":").map(Number);
    const total = h * 60 + m + mins;
    return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function minutesBetween(start: string, end: string): number {
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    return (eh * 60 + em) - (sh * 60 + sm);
}

const inputCls = "h-8 text-sm rounded-xs bg-white border border-light-border px-2";

interface Props {
    timeBlock: TimeBlock | null;
    onClose: () => void;
    onSaved: () => void;
}

export function ShiftEditModal({ timeBlock, onClose, onSaved }: Props) {
    const { setTimeblockToast } = useTimeBlocks();
    const dateInputRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("17:00");
    const [shiftType, setShiftType] = useState<"Pickup/Delivery" | "Warehouse">("Pickup/Delivery");
    const [volunteerGroups, setVolunteerGroups] = useState<VolunteerGroup[]>([]);
    const [notes, setNotes] = useState("");
    const [published, setPublished] = useState(false);

    useEffect(() => {
        if (!timeBlock) return;
        setName(timeBlock.name);
        setDate(toDateString(timeBlock.startTime));
        setStartTime(toTimeString(timeBlock.startTime));
        setEndTime(toTimeString(timeBlock.endTime));
        setShiftType(timeBlock.type);
        setVolunteerGroups(timeBlock.volunteerGroups);
        setNotes(timeBlock.notes);
        setPublished(timeBlock.published);
    }, [timeBlock]);

    useEffect(() => {
        if (!timeBlock) return;
        const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [timeBlock, onClose]);

    if (!timeBlock) return null;

    const handleStartChange = (newStart: string) => {
        setStartTime(newStart);
        if (minutesBetween(newStart, endTime) < 30) setEndTime(addMinutes(newStart, 30));
    };

    const handleEndChange = (newEnd: string) => {
        if (minutesBetween(startTime, newEnd) < 30) setEndTime(addMinutes(startTime, 30));
        else setEndTime(newEnd);
    };

    const updateGroupName = (idx: number, val: string) =>
        setVolunteerGroups(prev => prev.map((g, i) => i === idx ? { ...g, name: val } : g));

    const updateGroupMax = (idx: number, val: number) =>
        setVolunteerGroups(prev => prev.map((g, i) => i === idx ? { ...g, maxNum: val } : g));

    const deleteGroup = (idx: number) =>
        setVolunteerGroups(prev => prev.filter((_, i) => i !== idx));

    const handleSave = async () => {
        const updated: TimeBlock = {
            ...timeBlock!,
            name,
            type: shiftType,
            notes,
            published,
            startTime: Timestamp.fromDate(new Date(`${date}T${startTime}`)),
            endTime: Timestamp.fromDate(new Date(`${date}T${endTime}`)),
            volunteerGroups: volunteerGroups.filter(g => g.name.trim() !== ""),
        };
        await setTimeblockToast(updated);
        onSaved();
        onClose();
    };

    const addGroup = () =>
        setVolunteerGroups(prev => [...prev, { name: "", maxNum: 0, volunterIDs: [] }]);

    const handleShiftTypeChange = (newType: "Pickup/Delivery" | "Warehouse") => {
        setShiftType(newType);
        setVolunteerGroups(prev => {
            if (newType === "Warehouse") {
                const filtered = prev.filter(g => g.name !== "Lead Drivers");
                const hasGeneral = filtered.some(g => g.name === "General Volunteers");
                return hasGeneral ? filtered : [...filtered, { name: "General Volunteers", maxNum: 5, volunterIDs: [] }];
            } else {
                const hasLead = prev.some(g => g.name === "Lead Drivers");
                const hasGeneral = prev.some(g => g.name === "General Volunteers");
                let updated = [...prev];
                if (!hasLead) updated = [{ name: "Lead Drivers", maxNum: 2, volunterIDs: [] }, ...updated];
                if (!hasGeneral) updated = [...updated, { name: "General Volunteers", maxNum: 5, volunterIDs: [] }];
                return updated;
            }
        });
    };

    return createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40" onClick={onClose}>
            <div
                className="w-[37.5em] h-[44em] rounded-[0.625em] bg-[#FBFCFD] shadow-2xl flex flex-col overflow-hidden px-6 py-4"
                onClick={e => e.stopPropagation()}
            >
                {/* X button */}
                <div className="flex justify-end shrink-0">
                    <button onClick={onClose} className="text-slate-400 hover:opacity-60 transition-opacity">
                        <XIcon className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Title */}
                <div className="flex items-center shrink-0">
                    <PencilSimpleIcon className="w-5 h-5 text-gray-300 shrink-0 mr-2" />
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Enter Shift Title"
                        className="flex-1 text-xl font-bold bg-transparent outline-none text-primary placeholder:text-gray-300 placeholder:font-bold"
                    />
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto mt-4 flex flex-col">

                    {/* Date + Time row */}
                    <div className="flex items-center gap-2 shrink-0">
                        <Clock className="w-4 h-4 text-text-1 shrink-0" />

                        <button
                            type="button"
                            onClick={() => dateInputRef.current?.showPicker()}
                            className={`ml-[0.125em] w-40 ${inputCls} flex items-center overflow-hidden`}
                        >
                            {date
                                ? <span className="truncate text-slate-700">{formatDisplayDate(date)}</span>
                                : <span className="text-gray-300">Select date</span>
                            }
                        </button>
                        <input
                            ref={dateInputRef}
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className="sr-only"
                        />

                        <input
                            type="time"
                            value={startTime}
                            onChange={e => handleStartChange(e.target.value)}
                            className={`w-30 ${inputCls} [&::-webkit-calendar-picker-indicator]:hidden`}
                        />

                        <input
                            type="time"
                            value={endTime}
                            onChange={e => handleEndChange(e.target.value)}
                            className={`w-30 ${inputCls} [&::-webkit-calendar-picker-indicator]:hidden`}
                        />
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-[#E3E3E3] mt-4" />

                    {/* Shift Type */}
                    <div className="mt-4">
                        <div className="flex items-center gap-2">
                            <WarehouseIcon className="w-4 h-4 text-text-1 shrink-0" />
                            <span className="text-sm font-medium text-slate-700">Shift Type</span>
                        </div>
                        <div className="mt-2 pl-[1.625em] flex flex-col gap-1">
                            {(["Pickup/Delivery", "Warehouse"] as const).map(type => (
                                <div key={type} className="flex items-center gap-2 select-none">
                                    <button
                                        type="button"
                                        onClick={() => handleShiftTypeChange(type)}
                                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${shiftType === type ? "border-primary" : "border-gray-300"}`}
                                    >
                                        {shiftType === type && <div className="w-2 h-2 rounded-full bg-primary" />}
                                    </button>
                                    <span className="text-sm text-slate-700">
                                        {type === "Pickup/Delivery" ? "Pickups/Deliveries" : "Warehouse"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-[#E3E3E3] mt-4" />

                    {/* Volunteers */}
                    <div className="mt-4">
                        <div className="flex items-center gap-2">
                            <UsersIcon className="w-4 h-4 text-text-1 shrink-0" />
                            <span className="text-sm font-medium text-slate-700">Volunteers</span>
                        </div>
                        <div className="mt-2 flex flex-col gap-2">
                            {volunteerGroups.map((group, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={group.name}
                                        onChange={e => updateGroupName(idx, e.target.value)}
                                        placeholder="Enter Group Name"
                                        className={`ml-[1.625em] w-50 ${inputCls}`}
                                    />
                                    <input
                                        type="number"
                                        min={0}
                                        value={group.maxNum}
                                        onChange={e => updateGroupMax(idx, Number(e.target.value))}
                                        className={`w-16 ${inputCls}`}
                                    />
                                    <button onClick={() => deleteGroup(idx)} className="text-gray-300 hover:text-red-400 transition-colors">
                                        <XCircleIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={addGroup}
                            className="mt-2 ml-[1.625em] flex items-center gap-1 text-sm text-[#BBBDBE] hover:opacity-70 transition-opacity"
                        >
                            <PlusIcon className="w-4 h-4" />
                            Add Volunteer Group
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-[#E3E3E3] mt-4" />

                    {/* Shift Notes */}
                    <div className="mt-4 flex-1 flex flex-col">
                        <div className="flex items-center gap-2">
                            <TextAlignLeftIcon className="w-4 h-4 text-text-1 shrink-0" />
                            <span className="text-sm font-medium text-slate-700">Shift Notes</span>
                        </div>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Write notes telling volunteers what to do..."
                            className="mt-4 flex-1 w-full text-sm px-4 py-4 rounded-xs bg-white border border-light-border resize-none"
                        />
                    </div>

                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-700">Published</span>
                        <Switch
                            checked={published}
                            onCheckedChange={setPublished}
                            className="data-[state=unchecked]:bg-[#BFBFBF]"
                        />
                    </div>
                    <button
                        onClick={handleSave}
                        className="h-6 w-16 text-sm bg-primary text-white rounded-sm hover:opacity-90 transition-opacity"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
