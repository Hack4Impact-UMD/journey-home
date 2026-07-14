"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface ScopeModalProps {
    title: string;
    message: string;
    onThisShift: () => void | Promise<void>;
    onThisAndFollowing: () => void | Promise<void>;
    onCancel: () => void;
};

export function ScopeModal({ title, message, onThisShift, onThisAndFollowing, onCancel }: ScopeModalProps) {
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !isPending) onCancel();
        };
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleEscape);
        };
    }, [onCancel, isPending]);

    const handleChoice = async (choice: () => void | Promise<void>) => {
        setIsPending(true);
        try {
            await choice();
        } finally {
            setIsPending(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-70 flex items-center justify-center font-family-roboto bg-black/25">
            <div className="absolute inset-0" onClick={() => !isPending && onCancel()} />
            <div className="relative bg-white w-full max-w-sm px-6 py-4 flex flex-col rounded-xl">
                <h1 className="text-xl font-semibold mb-2">{title}</h1>
                <p className="text-[#8D8D8D] text-sm font-family-opensans mb-8">{message}</p>
                <div className="flex gap-8 justify-end">
                    <button className="text-sm text-primary hover:opacity-75 disabled:opacity-50" onClick={onCancel} disabled={isPending}>Cancel</button>
                    <button className="text-sm text-primary hover:opacity-75 disabled:opacity-50" onClick={() => handleChoice(onThisShift)} disabled={isPending}>This shift</button>
                    <button className="text-sm text-primary hover:opacity-75 disabled:opacity-50" onClick={() => handleChoice(onThisAndFollowing)} disabled={isPending}>This and following</button>
                </div>
            </div>
        </div>,
        document.body
    );
}
