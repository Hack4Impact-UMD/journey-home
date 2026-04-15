"use client";

import { DogSitIcon } from "@/components/icons/DogSitIcon";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function InvalidPerms() {
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
        <>
            <div className="w-full h-full flex items-center justify-center flex-col gap-4 bg-[#ECFBFE]">
                <DogSitIcon />
                <h1 className="text-3xl text-text-2 pt-3">Page not found.</h1>

                <div className="flex items-center justify-center flex-col pt-3">
                    <p className="text-text-2">
                        You don&apos;t have permissions to view this page
                    </p>
                    <div className="flex flex-row gap-4">
                        <button
                            className="border border-light-border px-3 py-1 rounded-lg font-family-roboto mt-[1rem] bg-background text-text-2"
                            onClick={() => router.push("/")}
                        >
                            Back to Home
                        </button>
                        {/* <button
                            className="border border-light-border px-3 py-1 rounded-lg font-family-roboto mt-4 bg-background text-text-2"
                            onClick={handleLogout}
                        >
                            Logout
                        </button> */}
                    </div>
                </div>
            </div>
        </>
    );
}
