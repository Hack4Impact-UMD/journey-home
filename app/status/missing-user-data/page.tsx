"use client";

import { StatusPage } from "@/components/general/StatusPage";
import { usePageTitle } from "@/lib/usePageTitle";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function MissingUserData() {
    usePageTitle("User Not Found | Journey Home");
    const router = useRouter();
    const auth = useAuth();

    const handleLogout = async () => {
        try {
            await auth.logout();
            router.push("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <StatusPage
            title="User not found"
            message="Could not find data for this user"
            onLogout={handleLogout}
        />
    );
}
