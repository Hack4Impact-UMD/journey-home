"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { sendEmailVerification } from "firebase/auth";
import { useState } from "react";
import { toast } from "sonner";
import MobileHeader from "@/components/auth/MobileHeader";

export default function VerifyEmailPage() {
    const router = useRouter();
    const { state } = useAuth();
    const [resending, setResending] = useState(false);

    const handleResendEmail = async () => {
        if (!state.currentUser) {
            toast.error("No user logged in");
            return;
        }

        setResending(true);
        try {
            await sendEmailVerification(state.currentUser);
            toast.success("Verification email sent! Check your inbox.");
        } catch (error) {
            console.error("Error sending verification email:", error);
            toast.error("Failed to send verification email. Please try again.");
        } finally {
            setResending(false);
        }
    };

    const handleCheckVerification = async () => {
        if (!state.currentUser) {
            toast.error("No user logged in");
            return;
        }

        // Reload user to get latest emailVerified status
        await state.currentUser.reload();
        
        if (state.currentUser.emailVerified) {
            toast.success("Email verified! Redirecting...");
            router.push("/");
        } else {
            toast.error("Email not verified yet. Please check your inbox and click the verification link.");
        }
    };

    return (
        <div className="flex h-screen overflow-hidden flex-col">
            <MobileHeader backTo="/login" />
            
            <div className="flex flex-1 overflow-hidden">
                {/* Background image - hidden on mobile */}
                <div className="hidden md:flex h-full max-w-[30em] overflow-hidden justify-center items-center">
                    <img
                        src="/background.png"
                        alt="Background"
                        className="object-cover min-h-full"
                    />
                </div>

                {/* Main content */}
                <div className="flex-1 flex items-center justify-center px-4 md:px-0">
                <div className="w-full max-w-[28em] text-center">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <img 
                            src="/homes.png" 
                            alt="Journey Home" 
                            className="w-[220px] h-[58px] object-contain"
                        />
                    </div>

                    <h1 className="text-2xl md:text-3xl font-bold font-family-raleway text-text-1 mb-6">
                        Verify Your Email
                    </h1>

                    <p className="text-gray-600 mb-8 px-4">
                        Click on the verification link sent to{" "}
                        <span className="text-primary font-semibold">{state.currentUser?.email}</span>
                    </p>

                    <div className="space-y-4 px-4">
                        <button
                            onClick={handleCheckVerification}
                            className="w-full h-12 rounded-md bg-primary text-white font-semibold"
                        >
                            I've Verified My Email
                        </button>

                        <button
                            onClick={handleResendEmail}
                            disabled={resending}
                            className="w-full h-12 rounded-md border-2 border-gray-300 text-gray-700 font-semibold disabled:opacity-50"
                        >
                            {resending ? "Sending..." : "Resend Email"}
                        </button>

                        <button
                            onClick={() => router.push("/login")}
                            className="w-full h-12 rounded-md text-gray-600 font-semibold"
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}
