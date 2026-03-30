"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import SideNavbar from "@/components/general/SideNav";
import { ReactNode } from "react";

export default function InventoryLayout({ children }: { children: ReactNode }) {

    return (
        <ProtectedRoute allow={["Admin"]}>
            <div className="h-full w-full flex flex-col font-family-roboto">
                <div className="flex flex-1">
                    <SideNavbar />
                    <div className="flex-1 min-h-0 bg-[#F7F7F7] pt-8 pb-4 px-6 flex flex-col">
                        <span className="text-2xl text-primary font-extrabold block">
                            Inventory
                        </span>
                        <div className="bg-background rounded-xl flex-wrap my-2 flex-1 py-4 px-6 min-h-0 overflow-hidden">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}