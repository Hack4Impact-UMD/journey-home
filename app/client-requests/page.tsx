"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function ClientRequestsPage() {
    const { state: authState } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (authState.loading || !authState.userData) return;

        if (authState.userData.role === "Admin") {
            router.replace("/client-requests/admin");
        } else if (authState.userData.role === "Case Manager") {
            router.replace("/client-requests/case-manager");
        }
    }, [authState, router]);

    return (
        <ProtectedRoute allow={["Admin", "Case Manager"]}>
            <div className="w-full h-full flex justify-center items-center pb-24">
                <Spinner className="size-12 text-primary" />
            </div>
        </ProtectedRoute>
    );
}
