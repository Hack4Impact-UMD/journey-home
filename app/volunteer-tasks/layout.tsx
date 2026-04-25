"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import Navbar from "@/components/general/Navbar";
import { ReactNode } from "react";

export default function VolunteerLayout({ children }: { children: ReactNode }) {
    return (
        <ProtectedRoute allow={["Volunteer"]}>
            <div className="h-full w-full flex flex-col font-family-roboto overflow-hidden">
                <div className="flex flex-1 min-h-0 max-md:flex-col">
                    <Navbar pageTitle="Shift Tasks" />
                    <div className="flex-1 min-h-0 bg-[#F7F7F7] max-md:bg-white pt-8 max-md:pt-1 pb-4 px-6 max-md:px-0 flex flex-col">
                        <span className="text-2xl text-primary font-extrabold block max-md:hidden">
                            Shift Tasks
                        </span>
                        <div className="bg-background max-md:bg-white rounded-xl max-md:rounded-none my-2 max-md:my-0 flex-1 py-4 max-md:py-0 px-6 min-h-0 overflow-hidden flex flex-col">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
