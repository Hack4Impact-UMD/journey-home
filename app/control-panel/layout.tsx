"use client";

import { ReactNode } from "react";
import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import TopNavbar from "@/components/general/TopNav";
import SideNavbar from "@/components/general/SideNav";

export default function ControlPanelLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <ProtectedRoute allow={["Admin"]}>
            <div className="h-full w-full flex flex-col font-family-roboto">
                <TopNavbar />

                <div className="flex flex-1 bg-[#F3F4F6]">
                    {/* sidebar */}
                    <div className="bg-white border-r border-gray-200 w-62.5 shrink-0">
                        <SideNavbar />
                    </div>

                    {/* main content */}
                    <div className="flex flex-1 p-8 gap-8">
                        <div className="flex-1">
                            {/* title */}
                            <h1 className="text-[28px] font-bold text-primary mb-6">
                                Control panel
                            </h1>

                            {/* tab bar */}
                            <div className="border-b border-gray-200 mb-6">
                                <button className="px-4 py-2 text-sm font-semibold border-b-2 border-primary text-primary">
                                    Categories
                                </button>
                            </div>

                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}