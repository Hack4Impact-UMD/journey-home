"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import SideNavbar from "@/components/general/SideNav";

export default function ScheduleLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute allow={["Admin", "Case Manager", "Volunteer"]}>
            <div className="h-full w-full flex flex-col font-family-roboto">
                
                <div className="flex flex-1">
                    <SideNavbar />
                    <div className="flex-1 bg-[#F7F7F7] py-4 px-6 flex flex-col">
                        {children}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}