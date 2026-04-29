"use client";

import { DogSitIcon } from "@/components/icons/DogSitIcon";
import Link from "next/link";

export function StatusPage({
    title,
    message,
    homePath = "/",
    onLogout,
}: {
    title: string;
    message: string;
    homePath?: string;
    onLogout?: () => void;
}) {
    return (
        <div className="w-full h-full flex items-center justify-center flex-col gap-4 bg-[#ECFBFE]">
            <DogSitIcon />
            <h1 className="text-3xl text-text-2 pt-3">{title}</h1>
            <div className="flex items-center justify-center flex-col pt-3">
                <p className="text-text-2">{message}</p>
                <div className="flex flex-row gap-4">
                    <Link
                        href={homePath}
                        className="border border-light-border px-3 py-1 rounded-lg font-family-roboto mt-4 bg-background text-text-2"
                    >
                        Back to Home
                    </Link>
                    {onLogout && (
                        <button
                            className="border border-light-border px-3 py-1 rounded-lg font-family-roboto mt-4 bg-background text-text-2"
                            onClick={onLogout}
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
