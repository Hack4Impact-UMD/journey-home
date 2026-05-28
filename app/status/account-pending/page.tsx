"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import AuthMobileNavbar from "@/components/auth/AuthMobileNavbar";
import { getUserByUID } from "@/lib/services/users";
import { auth } from "@/lib/firebase";

export default function AccountPending() {
    const authContext = useAuth();
    const router = useRouter();

    useEffect(() => {
        const handleFocus = async () => {
            if (!auth.currentUser) return;
            const userData = await getUserByUID(auth.currentUser.uid);
            if (userData?.disabled) {
                router.push("/status/account-disabled");
            } else if (!userData?.pending) {
                await authContext.refreshUser();
                router.push("/");
            }
        };
        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, [authContext, router]);

    const handleLogout = async () => {
        await authContext.logout();
        router.push("/login");
    };

    return (
        <div className="bg-background flex flex-col h-full overflow-hidden">
            <AuthMobileNavbar />
            
            <div className="flex flex-1 overflow-hidden">
                {/* Left side - background image */}
                <div className="hidden md:flex h-full max-w-[30em] overflow-hidden justify-center items-center">
                    <img
                        src="/background.png"
                        alt="Background"
                        className="object-cover min-h-full"
                    />
                </div>

                {/* Right side - content */}
                <div className="flex flex-1 flex-col h-full items-center justify-center" style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
                <div className="flex flex-col items-center w-full max-w-[28em]">
                    {/* Logo */}
                    <div className="flex justify-center mb-16 cursor-pointer" onClick={() => router.push('/login')}>
                        <img
                            src="/journey-home-logo.png"
                            alt="Journey Home"
                            className="hidden md:block h-[6em] w-[22em]"
                        />
                        <img
                            src="/house-mobile-logo.png"
                            alt="Journey Home"
                            className="md:hidden w-full h-auto"
                        />
                    </div>

                    {/* Heading */}
                    <h1 className="text-2xl font-bold font-family-roboto text-text-1 mb-6">
                        Account Pending
                    </h1>

                    {/* Message */}
                    <p className="text-center font-family-roboto text-text-1 mb-12 md:px-8">
                        Thanks for requesting to be a part of the Journey Home
                        team! You can expect to hear back from us within X
                        business days.
                    </p>

                    {/* Back to Login button */}
                    <button
                        onClick={handleLogout}
                        className="w-full h-10 rounded-xs bg-primary text-white font-medium font-family-roboto"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
        </div>
    );
}
