"use client";

import { createPortal } from "react-dom";
import { useId, useEffect } from "react";

type ConfirmModalProps = {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    disabled?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

export function ConfirmModal({
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    disabled = false,
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    const titleId = useId();
    const descId = useId();

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCancel();
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onCancel]);

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center font-family-roboto">
            <div className="absolute inset-0" onClick={onCancel} />
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descId}
                className="relative bg-white border-2 border-dashed border-primary rounded-sm w-full max-w-md max-h-[80vh] mx-4 flex flex-col"
            >
                <div className="sticky top-0 bg-white px-6 py-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                    <h2 id={titleId} className="font-bold text-xl text-text-1">{title}</h2>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <p id={descId} className="text-sm text-[#888]">{message}</p>
                </div>

                <div className="sticky bottom-0 bg-white px-6 py-4 shadow-[0_-2px_6px_rgba(0,0,0,0.08)] flex gap-6 justify-end">
                    <button
                        className="text-sm font-medium text-primary hover:opacity-75"
                        onClick={onCancel}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        className="text-sm font-medium text-primary hover:opacity-75 disabled:opacity-40 disabled:cursor-not-allowed"
                        onClick={onConfirm}
                        disabled={disabled}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
