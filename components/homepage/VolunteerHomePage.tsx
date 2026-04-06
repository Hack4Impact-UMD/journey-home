"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import SideNavbar from "@/components/general/SideNav";
import ShiftTaskSummary from "./ShiftTaskSummary";
import AvailableShiftsSummary from "./AvailableShiftsSummary";
import { useAuth } from "@/contexts/AuthContext";

export default function VolunteerHomePage() {
    // display the name of the user 
    const { state } = useAuth();
    const user = state.currentUser;

    const name =
        user?.displayName ||
        user?.email?.split("@")[0] ||
        "Volunteer";

    return (
        <ProtectedRoute allow={["Volunteer"]}>
            <div className="h-full w-full flex flex-col font-family-roboto">
                <div className="flex flex-1">
                    <SideNavbar />
                    <div className="flex-1 bg-[#F7F7F7] pt-8 pb-4 px-6 flex flex-col gap-6">
                        <span className="text-2xl text-primary font-extrabold block">
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