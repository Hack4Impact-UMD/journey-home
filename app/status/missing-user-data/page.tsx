"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function MissingUserData() {

    const auth = useAuth();
    const router = useRouter();

    return <>
        <div className="w-full h-full flex items-center align-center flex-col p-10 gap-2">
                <h1>Error: Couldn&apos;t find data for this user</h1>

                <button
                    className="border border-light-border px-8 rounded-xs font-family-roboto"
                    onClick={() => auth.logout().then(() => router.push("/login"))}
                >
                    Logout
                </button>
            </div>
    </>
}