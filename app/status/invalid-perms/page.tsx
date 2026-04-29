"use client";

import { StatusPage } from "@/components/general/StatusPage";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function InvalidPerms() {
    const auth = useAuth();
    const router = useRouter();

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
            title="Insufficient Permissions"
            message="You don't have permissions to view this page"
            onLogout={handleLogout}
        />
    );
}
