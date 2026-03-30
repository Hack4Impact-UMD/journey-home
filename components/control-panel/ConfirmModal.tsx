"use client";

import { createPortal } from "react-dom";
import { useId, useEffect } from "react";

type ConfirmModalProps = {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export function ConfirmModal({
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
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
                className="relative bg-white border-2 border-dashed border-primary rounded-sm w-full max-w-md p-6 mx-4"
            >
                <h2 id={titleId} className="font-bold text-xl text-text-1 mb-4">{title}</h2>
                <p id={descId} className="text-sm text-[#888] mb-8">{message}</p>
                <div className="flex gap-6 justify-end">
                    <button
                        className="text-sm font-medium text-primary hover:opacity-75"
                        onClick={onCancel}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        className="text-sm font-medium text-primary hover:opacity-75"
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
