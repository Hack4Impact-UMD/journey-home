"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import Navbar from "@/components/general/Navbar";
import ShiftTaskSummary from "./ShiftTaskSummary";
import AvailableShiftsSummary from "./AvailableShiftsSummary";
import { useAuth } from "@/contexts/AuthContext";

export default function VolunteerHomePage() {
    const { state } = useAuth();
    const user = state.userData;

    const name = user?.firstName ||"Volunteer";

    return (
        <ProtectedRoute allow={["Volunteer"]}>
            <div className="h-full w-full flex flex-col font-family-roboto">
                <div className="flex flex-1 min-h-0 max-md:flex-col">
                    <Navbar />
                    <div className="flex-1 overflow-y-auto bg-white pt-8 max-md:pt-4 pb-4 px-6 flex flex-col gap-6">
                        <span className="text-4xl font-semibold text-primary leading-none block">
                            Welcome, {name}!
                        </span>

                        {/* shift tasks */}
                        <ShiftTaskSummary />

                        {/* available shifts */}
                        <AvailableShiftsSummary />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}