"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import SideNavbar from "@/components/general/SideNav";
import TopNavbar from "@/components/general/TopNav";
import { ReactNode } from "react";

export default function PickupsDeliveriesLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <ProtectedRoute allow={["Admin"]}>
            <div className="h-full w-full flex flex-col font-family-roboto">
                <TopNavbar />
                <div className="flex flex-1">
                    <SideNavbar />
                    <div className="flex-1 bg-[#F7F7F7] py-4 px-6 flex flex-col">
                        <span className="text-2xl text-primary font-extrabold block">
                            Pickups and Deliveries
                        </span>
                        {children}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
