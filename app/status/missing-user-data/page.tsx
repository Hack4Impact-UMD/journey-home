"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function MissingUserData() {
    const auth = useAuth();
    const router = useRouter();

    return (
        <>
            <div className="w-full h-full flex items-center justify-center flex-col gap-4 bg-[#ECFBFE]">
                <h1 className="text-3xl text-text-2">Page not found.</h1>

                <div className = "flex items-center justify-center flex-col pt-[2rem]">
                    <p className="text-text-2">
                        Could not find data for this user
                    </p>

                    <button
                        className="border border-light-border px-3 py-1 rounded-lg font-family-roboto mt-[1rem] bg-background text-text-2"
                        onClick={() =>
                            auth.logout().then(() => router.push("/login"))
                        }
                    >
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
}
