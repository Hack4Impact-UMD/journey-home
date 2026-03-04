"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import SideNavbar from "@/components/general/SideNav";
import TopNavbar from "@/components/general/TopNav";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
    const { state } = useAuth();
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(() => 
        typeof window !== "undefined" ? window.innerWidth < 768 : false
    );

    useEffect(() => {
        // Check if viewport is mobile size
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // If not logged in and on mobile, show mobile landing
    if (!state.loading && !state.currentUser && isMobile) {
        return (
            <div className="flex flex-col min-h-screen bg-white">
                {/* Top spacer */}
                <div className="flex-[0.3]"></div>

                {/* House icon at top */}
                <div className="flex justify-center pb-4">
                    <img 
                        src="/homes.png" 
                        alt="Journey Home Icon" 
                        className="w-[220px] h-[58px] object-contain"
                    />
                </div>

                {/* Journey and Home text */}
                <div className="text-center mb-8">
                    <h1 className="text-6xl font-raleway text-primary leading-none" style={{ fontWeight: 300 }}>JOURNEY</h1>
                    <h1 className="text-6xl font-raleway text-[#FBCF0B] leading-none" style={{ fontWeight: 400 }}>HOME</h1>
                </div>

                {/* Spacer to push content down */}
                <div className="flex-1"></div>

                {/* Tagline */}
                <div className="px-8 mb-6">
                    <p className="text-2xl font-raleway leading-none text-left" style={{ fontWeight: 400 }}>
                        TOGETHER WE CAN END HOMELESSNESS
                    </p>
                </div>

                {/* Buttons */}
                <div className="px-8 pb-12">
                    <div className="w-full max-w-sm mx-auto space-y-4">
                        <button
                            onClick={() => router.push("/signup")}
                            className="w-full h-12 rounded-md bg-primary text-white font-semibold text-lg"
                        >
                            Create Account
                        </button>
                        
                        <button
                            onClick={() => router.push("/login")}
                            className="w-full h-12 rounded-md border-2 border-primary text-primary font-semibold text-lg"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <ProtectedRoute allow={["Admin", "Case Manager", "Volunteer"]}>
            <div className="h-full w-full flex flex-col font-family-roboto">
                <TopNavbar />
                <div className="flex flex-1">
                    <SideNavbar />
                    <div className="flex-1  bg-[#F7F7F7] py-4 px-6 flex flex-col">
                        <span className="text-2xl text-primary font-extrabold block">
                            Journeying to the Home Page!
                        </span>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
