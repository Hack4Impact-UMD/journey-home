"use client";

import { usePageTitle } from "@/lib/usePageTitle";

export default function VolunteerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    usePageTitle("Volunteer – Journey Home");
    return (
        <div className="min-h-screen bg-white md:bg-[#D8E3E5] md:py-21.5">
            <div className="md:max-w-270 md:mx-auto md:bg-white md:rounded-lg md:shadow-md">
                {children}
            </div>
        </div>
    );
}
