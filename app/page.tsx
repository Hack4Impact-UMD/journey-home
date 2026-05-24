"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import AdminHomePage from "@/components/homepage/AdminHomePage";
import VolunteerHomePage from "@/components/homepage/VolunteerHomePage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
    const { state: authState } = useAuth();
    const role = authState.userData?.role;
    const router = useRouter();

    useEffect(() => {
        if (authState.loading || !authState.userData) return;
        if (authState.userData.role === "Case Manager") {
            router.replace("/client-requests");
        }
    }, [authState, router]);

    return (
        <ProtectedRoute allow={["Admin", "Case Manager", "Volunteer"]}>
            {role === "Admin" && <AdminHomePage />}
            {role === "Volunteer" && <VolunteerHomePage />}
        </ProtectedRoute>
    );
}
