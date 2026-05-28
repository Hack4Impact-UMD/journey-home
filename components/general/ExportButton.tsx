"use client";

import { Upload } from "lucide-react";

type ExportButtonProps = {
    label: string;
    onClick: () => void;
    className?: string;
};

export function ExportButton({ label, onClick, className = "" }: ExportButtonProps) {
    return (
        <button
            type="button"
            className={`bg-primary text-white px-3 py-1.5 text-sm rounded-xs flex items-center gap-1.5 shrink-0 ${className}`}
            onClick={onClick}
        >
            <Upload size={16} />
            {label}
        </button>
    );
}
