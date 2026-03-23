"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import SideNavbar from "@/components/general/SideNav";
import TopNavbar from "@/components/general/TopNav";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function ControlPanelLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    return (
        <ProtectedRoute allow={["Admin"]}>
            <div className="h-full w-full flex flex-col font-family-roboto overflow-hidden">
                <TopNavbar />
                <div className="flex flex-1 min-h-0">
                    <SideNavbar />
                    <div className="flex-1 min-h-0 bg-[#F7F7F7] py-4 px-6 flex flex-col">
                        <span className="text-2xl text-primary font-extrabold block">
                            Control Panel
                        </span>
                        <div className="flex gap-8 text-sm">
                            <Link
                                className={`py-4${
                                    pathname === "/control-panel"
                                        ? " border-b-2 border-primary text-primary"
                                        : ""
                                }`}
                                href="/control-panel"
                                suppressHydrationWarning
                            >
                                Overview
                            </Link>
                            <Link
                                className={`py-4${
                                    pathname.startsWith("/control-panel/warehouse-history")
                                        ? " border-b-2 border-primary text-primary"
                                        : ""
                                }`}
                                href="/control-panel/warehouse-history"
                                suppressHydrationWarning
                            >
                                Warehouse History
                            </Link>
                        </div>
                        <div className="bg-background rounded-xl my-2 flex-1 py-4 px-6 min-h-0 overflow-hidden flex flex-col">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
