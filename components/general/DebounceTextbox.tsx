"use client";

import { useEffect, useRef, useState } from "react";

function formatLabel(lastSavedAt: Date): string {
    const seconds = Math.floor((Date.now() - lastSavedAt.getTime()) / 1000);
    if (seconds < 30) return "Saved just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Saved ${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Saved ${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    const days = Math.floor(hours / 24);
    return `Saved ${days} ${days === 1 ? "day" : "days"} ago`;
}

export function DebounceTextbox({
    initialValue,
    debounceMs,
    onUpdate,
    setEditSince,
    placeholder,
    className,
}: {
    initialValue: string;
    debounceMs: number;
    onUpdate: (value: string) => Promise<void> | void;
    setEditSince?: (label: string | null) => void;
    placeholder?: string;
    className?: string;
}) {
    const [value, setValue] = useState(initialValue);

    const pendingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pendingValueRef = useRef(initialValue);
    const hasPendingRef = useRef(false);
    const lastSavedAtRef = useRef<Date | null>(null);
    const onUpdateRef = useRef(onUpdate);
    const setEditSinceRef = useRef(setEditSince);

    onUpdateRef.current = onUpdate;
    setEditSinceRef.current = setEditSince;

    const flushRef = useRef<() => Promise<void>>(async () => {});
    flushRef.current = async () => {
        if (!hasPendingRef.current) return;
        if (pendingTimerRef.current !== null) {
            clearTimeout(pendingTimerRef.current);
            pendingTimerRef.current = null;
        }
        hasPendingRef.current = false;
        const val = pendingValueRef.current;
        setEditSinceRef.current?.("Saving...");
        try {
            await onUpdateRef.current(val);
            lastSavedAtRef.current = new Date();
            setEditSinceRef.current?.(formatLabel(lastSavedAtRef.current));
        } catch {
            // Parent handles error notification; lastSavedAt stays unchanged
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        pendingValueRef.current = newValue;
        hasPendingRef.current = true;
        setEditSinceRef.current?.("Not saved");
        if (pendingTimerRef.current !== null) clearTimeout(pendingTimerRef.current);
        pendingTimerRef.current = setTimeout(() => flushRef.current(), debounceMs);
    };

    // Report "no save yet" on mount and start label refresh interval
    useEffect(() => {
        setEditSinceRef.current?.(null);
        const id = setInterval(() => {
            if (lastSavedAtRef.current) {
                setEditSinceRef.current?.(formatLabel(lastSavedAtRef.current));
            }
        }, 60_000);
        return () => {
            clearInterval(id);
            flushRef.current();
        };
    }, []);

    return (
        <textarea
            value={value}
            onChange={handleChange}
            onBlur={() => flushRef.current()}
            placeholder={placeholder}
            className={`w-full h-full resize-none border border-light-border rounded-xs text-sm text-text-1 placeholder:text-[#BFBFBF] p-3 outline-none focus:ring-0${className ? ` ${className}` : ""}`}
        />
    );
}
