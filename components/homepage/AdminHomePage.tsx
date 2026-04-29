"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import Navbar from "@/components/general/Navbar";
import AdminCalendarSummary from "./AdminCalendarSummary";
import WarehouseHistorySummary from "./WarehouseHistorySummary";
import { PickupsDeliveriesSummary } from "./PickupsDeliveriesSummary";
import { QuickStatsSummary } from "./QuickStatsSummary";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminHomePage() {
    const {
        state: { userData },
    } = useAuth();

    return (
        <ProtectedRoute allow={["Admin"]}>
            <div className="h-full w-full flex flex-col font-family-roboto">
                <div className="flex flex-1 min-h-0 max-md:flex-col">
                    <Navbar />
                    <div className="flex-1 flex flex-col overflow-auto pt-8 pb-15 px-10 gap-6 bg-linear-to-r from-[#F8FDFE] to-[#DAF2F5] border-l border-light-border">
                        <h1 className="text-5xl text-primary font-extrabold">
                            Welcome, {userData?.firstName ?? ""}!
                        </h1>
                        <div className="flex gap-4 flex-1 min-h-0">
                            {/* Left column */}
                            <div className="flex flex-col gap-4 w-[47%] min-w-0 min-h-0">
                                <div className="flex-1 min-h-0">
                                    <QuickStatsSummary />
                                </div>
                                <div className="flex-1 min-h-0">
                                    <WarehouseHistorySummary />
                                </div>
                            </div>
                            {/* Right column */}
                            <div className="flex flex-col gap-4 w-[52%] flex-1 min-w-0 min-h-0">
                                <div className="flex-1 min-h-0">
                                    <PickupsDeliveriesSummary />
                                </div>
                                <div className="flex-1 min-h-0">
                                    <AdminCalendarSummary />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
