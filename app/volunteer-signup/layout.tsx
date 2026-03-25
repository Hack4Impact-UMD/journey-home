"use client";

import { ReactNode, useState } from "react";
import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import SideNavbar from "@/components/general/SideNav";

export default function VolunteerSignupLayout({
    children,
}: {
    children: ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <ProtectedRoute allow={["Volunteer", "Admin"]}>
            <div className="h-full w-full flex flex-col font-family-roboto">
                {/* main content */}
                <div className="flex flex-1 relative">

                    {/* mobile only */}
                    {isSidebarOpen && (
                        <div
                            className="fixed inset-0 bg-black/30 z-40 md:hidden"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                    )}

                    {/* sidebar */}
                    <div
                        className={`
                            fixed top-0 left-0 h-full bg-white z-50
                            transform transition-transform duration-300
                            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                            md:translate-x-0 md:static
                        `}
                    >
                        <SideNavbar />
                    </div>

                    <div className="flex-1 md:bg-gray-100 py-4 pr-4 md:pl-10 md:pr-6 flex flex-col">
                        
                        {/* header section */}
                        <div className="border-b border-gray-200 md:border-none pb-3 ml-4 mt-2 md:ml-2">
                            
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() =>
                                        setIsSidebarOpen((prev) => !prev)
                                    }
                                    className="md:hidden text-2xl"
                                >
                                    ☰
                                </button>

                                <h1 className="text-[24px] font-bold text-primary">
                                    Shift Sign-up
                                </h1>
                            </div>

                            <button className="hidden md:flex mt-1 md:mt-4 text-sm border-b-2 border-primary text-primary">
                                List View
                            </button>
                        </div>

                        {children}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}