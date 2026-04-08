"use client";

import { createPortal } from "react-dom";
import { useEffect } from "react";

type ConfirmModalProps = {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export function ConfirmModal({ title, message, onConfirm, onCancel }: ConfirmModalProps) {
    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCancel();
        };
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleEscape);
        };
    }, [onCancel]);

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center font-family-roboto bg-black/25">
            <div className="absolute inset-0" onClick={onCancel} />
            <div className="relative bg-white w-full max-w-sm px-6 py-4 flex flex-col rounded-xl">
                <h1 className="text-xl font-semibold mb-2">{title}</h1>
                <p className="text-[#8D8D8D] text-sm font-family-opensans mb-8">{message}</p>
                <div className="flex gap-8 justify-end">
                    <button className="text-sm text-primary hover:opacity-75" onClick={onCancel}>Cancel</button>
                    <button className="text-sm text-primary hover:opacity-75" onClick={onConfirm}>Confirm</button>
                </div>
            </div>
        </div>,
        document.body
    );
}
