"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import SideNavbar from "@/components/general/SideNav";
import AdminCalendarSummary from "./AdminCalendarSummary";
import WarehouseHistorySummary from "./WarehouseHistorySummary";
import { PickupsDeliveriesSummary } from "./PickupsDeliveriesSummary";
import { QuickStatsSummary } from "./QuickStatsSummary";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminHomePage() {
    const { state: { userData } } = useAuth();

    return (
        <ProtectedRoute allow={["Admin"]}>
            <div className="h-full w-full flex flex-col font-family-roboto">
                <div className="flex flex-1 min-h-0">
                    <SideNavbar />
                    <div className="flex-1 flex flex-col overflow-auto pt-8 pb-4 px-6 gap-4 bg-linear-to-r from-[#F8FDFE] to-[#DAF2F5]">
                        <h1 className="text-4xl text-primary font-extrabold">
                            Welcome, {userData?.firstName ?? ""}!
                        </h1>
                        <div className="flex gap-4 flex-1 min-h-0">
                            {/* Left column */}
                            <div className="flex flex-col gap-4 w-[45%] min-w-0">
                                <QuickStatsSummary />
                                <WarehouseHistorySummary />
                            </div>
                            {/* Right column */}
                            <div className="flex flex-col gap-4 flex-1 min-w-0">
                                <PickupsDeliveriesSummary />
                                <AdminCalendarSummary />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
