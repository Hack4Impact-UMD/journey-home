"use client";

import SideNavbar from "@/components/SideNav";
import TopNavbar from "@/components/TopNav";
import { ReactNode } from "react";

export default function PickupsDeliveriesLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
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
    );
}

