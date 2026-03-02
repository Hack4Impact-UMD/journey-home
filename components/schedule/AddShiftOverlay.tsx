import { useState } from "react";
import { createTB } from "../../lib/services/timeblocks";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onShiftCreated: () => void;
}

export function AddShiftOverlay({ isOpen, onClose, onShiftCreated }: Props) {
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [shiftType, setShiftType] = useState<"pickup" | "warehouse" | null>(null);
    const [openToVolunteers, setOpenToVolunteers] = useState(false);
    const [maxVolunteers, setMaxVolunteers] = useState("");
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!startTime || !endTime || !shiftType || (openToVolunteers && !maxVolunteers)) {
            setError("Please fill in all required fields.");
            return;
        }
        setError("");
        await createTB(startTime, endTime, openToVolunteers ? Number(maxVolunteers) : 0);
        onShiftCreated();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/20" onClick={onClose} />

            <div className="relative w-72 bg-gray-50 rounded-xl shadow-xl divide-y divide-gray-200">
                <div className="p-4">
                    <p className="font-bold text-slate-700 mb-3">Time</p>
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="text-xs text-slate-400">Start</label>
                            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)}
                                className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-sm mt-1" />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs text-slate-400">End</label>
                            <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)}
                                className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-sm mt-1" />
                        </div>
                    </div>
                </div>

                <div className="p-4">
                    <p className="font-bold text-slate-700 mb-3">Type of shift</p>
                    {(["pickup", "warehouse"] as const).map(type => (
                        <label key={type} className="flex items-center gap-2 mb-2 cursor-pointer">
                            <input type="radio" name="shiftType" checked={shiftType === type}
                                onChange={() => setShiftType(type)} className="accent-[#02AFC7]" />
                            <span className="text-sm text-slate-700">
                                {type === "pickup" ? "Pickup/deliveries" : "Warehouse"}
                            </span>
                        </label>
                    ))}
                </div>

                <div className="p-4">
                    <p className="font-bold text-slate-700 mb-3">Volunteers</p>
                    <label className="flex items-center gap-2 mb-3 cursor-pointer">
                        <input type="checkbox" checked={openToVolunteers}
                            onChange={e => setOpenToVolunteers(e.target.checked)} className="accent-[#02AFC7]" />
                        <span className="text-sm text-slate-700">Open to volunteers</span>
                    </label>
                    <label className="text-xs text-slate-400 block mb-1">No. of volunteers</label>
                    <input type="number" min={0} value={maxVolunteers}
                        disabled={!openToVolunteers}
                        onChange={e => setMaxVolunteers(e.target.value)}
                        className="w-32 border border-gray-200 rounded-md px-2 py-1.5 text-sm disabled:opacity-40" />
                    {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
                </div>

                <div className="p-3 flex justify-end">
                    <button onClick={handleSave}
                        className="bg-[#02AFC7] hover:bg-[#0299B0] text-white text-sm font-semibold px-5 py-2 rounded-md">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}