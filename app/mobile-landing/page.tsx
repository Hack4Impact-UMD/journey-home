"use client";

import { useRouter } from "next/navigation";

export default function MobileLandingPage() {
    const router = useRouter();

    return (
        <div className="flex flex-col h-screen bg-white">
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

            {/* Footer text */}
            <div className="pb-8 text-center text-sm text-gray-600">
                <p>Welcome to Journey Home</p>
            </div>
        </div>
    );
}
