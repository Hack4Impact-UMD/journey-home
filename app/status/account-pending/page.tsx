"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function AccountPending() {
    const auth = useAuth();

    return (
        <div className="bg-background flex h-full overflow-hidden">
            {/* Left side - background image - hidden on mobile */}
            <div className="hidden md:flex shrink-0 items-start justify-start h-full">
                <img
                    src="/background.png"
                    alt="Background"
                    className="h-[58em] w-[30em] object-cover object-left overflow-hidden"
                />
            </div>

            {/* Right side - content */}
            <div className="flex flex-1 flex-col h-full items-center justify-center px-4 md:px-0">
                <div className="flex flex-col items-center w-full max-w-[28em]">
                    {/* Logo */}
                    <div className="flex justify-center mb-8 md:mb-16">
                        <img
                            src="/homes.png"
                            alt="Journey Home"
                            className="w-[220px] h-[58px] object-contain"
                        />
                    </div>

                    {/* Heading */}
                    <h1 className="text-2xl font-bold font-family-roboto text-text-1 mb-6">
                        Account Pending
                    </h1>

                    {/* Message */}
                    <p className="text-center font-family-roboto text-text-1 mb-12 px-8">
                        Thanks for requesting to be a part of the Journey Home
                        team! You can expect to hear back from us within 3
                        business days.
                    </p>

                    {/* Back to Login button */}
                    <button
                        onClick={auth.logout}
                        className="w-full h-10 rounded-xs bg-primary text-white font-medium font-family-roboto"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
