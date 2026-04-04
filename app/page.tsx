"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import AdminHomePage from "@/components/homepage/AdminHomePage";
import CaseManagerHomePage from "@/components/homepage/CaseManagerHomePage";
import VolunteerHomePage from "@/components/homepage/VolunteerHomePage";

export default function HomePage() {
    const { state: { userData } } = useAuth();
    const role = userData?.role;

    return (
        <ProtectedRoute allow={["Admin", "Case Manager", "Volunteer"]}>
            {role === "Admin" && <AdminHomePage />}
            {role === "Case Manager" && <CaseManagerHomePage />}
            {role === "Volunteer" && <VolunteerHomePage />}
        </ProtectedRoute>
    );
}