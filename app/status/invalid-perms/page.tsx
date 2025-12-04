"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function InvalidPerms() {
    const router = useRouter();
    const auth = useAuth();

    return (
        <>
            <div className="w-full h-full flex items-center align-center flex-col p-10 gap-2">
                <h1>You don&apos;t have permissions to view this page</h1>
                <button
                    className="border border-light-border px-8 rounded-xs font-family-roboto"
                    onClick={() => router.push("/")}
                >
                    Home
                </button>
                <button
                    className="border border-light-border px-8 rounded-xs font-family-roboto"
                    onClick={() => auth.logout().then(() => router.push("/login"))}
                >
                    Logout
                </button>
            </div>
        </>
    );
}
