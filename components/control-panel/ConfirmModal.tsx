"use client";

import { createPortal } from "react-dom";
import { useId, useEffect } from "react";
import { CloseIcon } from "../icons/CloseIcon";

type ConfirmModalProps = {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    danger?: boolean;
};

export function ConfirmModal({
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    onConfirm,
    onCancel,
    danger = false,
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
            <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descId}
                className="relative bg-white rounded-sm shadow-lg w-full max-w-md p-6 mx-4"
            >
                <div className="flex items-center justify-between mb-3">
                    <span id={titleId} className="font-bold text-lg">{title}</span>
                    <button onClick={onCancel} aria-label="Close dialog" className="text-xl">
                        <CloseIcon />
                    </button>
                </div>
                <p id={descId} className="text-sm text-text-1 mb-6">{message}</p>
                <div className="flex gap-2 justify-end">
                    <button
                        className="rounded-xs h-8 px-4 border border-light-border text-sm"
                        onClick={onCancel}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        className={`rounded-xs h-8 px-4 text-sm text-white ${danger ? "bg-red-500" : "bg-primary"}`}
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
