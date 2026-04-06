"use client";

import { useState } from "react";
import { BoxIcon } from "lucide-react";
import { InventoryCategory } from "@/types/inventory";

interface EditCountModalProps {
    category: InventoryCategory;
    onClose: () => void;
    onSubmit: (newCount: number) => void;
}

export function EditCountModal({ category, onClose, onSubmit }: EditCountModalProps) {
    const [inputValue, setInputValue] = useState<string>(String(category.quantity));

    const parsed = parseInt(inputValue, 10);
    const isValid = !isNaN(parsed) && parsed >= 0;
    const change = isValid ? parsed - category.quantity : 0;

    const changeDisplay = (() => {
        if (!isValid || change === 0) return null;
        if (change > 0) return { label: `+${change}`, color: "#70C114" };
        return { label: `${change}`, color: "#FF6B4A" };
    })();

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={onClose}
        >
            <div
                className="relative bg-white rounded-2xl shadow-xl w-[340px] p-6 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute -bottom-6 -right-6 pointer-events-none select-none opacity-10">
                    <BoxIcon className="w-52 h-52 text-gray-400" strokeWidth={1} />
                </div>

                <h2 className="text-2xl font-bold text-[#17B8C4] mb-5">{category.name}</h2>

                <input
                    type="number"
                    min={0}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-36 border border-gray-200 rounded-lg px-4 py-2 text-lg text-center text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#17B8C4] mb-3"
                />

                <div className="text-sm text-gray-500 mb-1">
                    Original Count: {category.quantity}
                </div>
                <div className="text-sm text-gray-500 mb-6">
                    Change:{" "}
                    {changeDisplay ? (
                        <span className="font-semibold" style={{ color: changeDisplay.color }}>
                            {changeDisplay.label}
                        </span>
                    ) : (
                        <span className="font-semibold text-gray-400">0</span>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        disabled={!isValid}
                        onClick={() => isValid && onSubmit(parsed)}
                        className="bg-[#17B8C4] hover:bg-[#13a3ae] disabled:opacity-40 text-white font-medium px-8 py-2.5 rounded-xl transition-colors"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}