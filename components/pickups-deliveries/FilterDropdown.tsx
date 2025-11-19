"use client";

import { useState } from "react";
import { DropdownIcon } from "../icons/DropdownIcon";

type FilterDropdownProps = {
    label: string;
    options?: string[];
    value?: string;
    onChange?: (value: string) => void;
};

export default function FilterDropdown({
    label,
    options = [],
    value,
    onChange,
}: FilterDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white border border-light-border rounded-[2px] px-4 py-1.5 flex items-center gap-2 min-w-[72px]"
            >
                <span className="text-sm text-black">{label}</span>
                <DropdownIcon />
            </button>
            {isOpen && options.length > 0 && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-light-border rounded-[2px] shadow-lg z-10 min-w-full">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => {
                                onChange?.(option);
                                setIsOpen(false);
                            }}
                            className="w-full px-4 py-2 text-sm text-black hover:bg-gray-50 text-left first:rounded-t-[2px] last:rounded-b-[2px]"
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

