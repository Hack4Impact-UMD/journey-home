"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import AuthMobileNavbar from "@/components/auth/AuthMobileNavbar";
import { WaiverPdfViewer } from "@/components/control-panel/WaiverPdfViewer";
import { useWaivers } from "@/lib/queries/waivers";
import { signWaiver } from "@/lib/services/users";
import { toast } from "sonner";

export default function WaiverPending() {
    const auth = useAuth();
    const router = useRouter();
    const { currentWaiver } = useWaivers();

    const [agreed, setAgreed] = useState(false);
    const [error, setError] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!auth.state.loading && auth.state.userData?.signedWaiver) {
            router.replace("/");
        }
    }, [auth.state.loading, auth.state.userData, router]);

    const handleContinue = async () => {
        if (!agreed) {
            setError(true);
            return;
        }
        const uid = auth.state.currentUser?.uid;
        if (!uid) return;
        setSubmitting(true);
        const p = signWaiver(uid);
        toast.promise(p, {
            loading: "Submitting waiver...",
            success: "Waiver signed successfully.",
            error: "Failed to submit waiver.",
        });
        try {
            await p;
            await auth.refreshUser();
            router.push("/");
        } catch (e: unknown) {
            const code = (e as { code?: string }).code;
            if (code === "permission-denied") {
                toast.error("You don't have permission to sign the waiver.");
                setSubmitting(false);
                return;
            }
            if (code === "unavailable") {
                toast.error("Network error. Please try again.");
                setSubmitting(false);
                return;
            }
            throw e;
        }
    };

    return (
        <div className="bg-background flex flex-col h-screen overflow-hidden">
            <AuthMobileNavbar onBack={() => router.push("/login")} />

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
                <div className="flex flex-1 flex-col h-full overflow-auto">
                    <div className="flex flex-col w-full px-4 md:px-16 pt-6 md:pt-12 pb-12 max-w-[64em] mx-auto">
                        <div className="relative mb-3 mt-2 md:mt-8">
                            <button onClick={() => router.push("/login")} className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 text-2xl">
                                ←
                            </button>
                            <h1 className="text-center text-2xl font-bold font-family-roboto text-text-1">
                                Waiver Agreement
                            </h1>
                        </div>
                        <p className="text-sm text-text-1 mb-6 w-full text-center">
                            Please read and accept this liability waiver in order to volunteer with Journey Home.
                        </p>

                        <p className="text-lg font-medium text-text-1 mb-3">Waiver Document</p>
                        <div className="hidden md:block h-[32em] mb-8">
                            <WaiverPdfViewer url={currentWaiver?.file ?? ""} />
                        </div>
                        <a
                            href={currentWaiver?.file ?? "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="md:hidden flex items-center justify-center w-full h-10 rounded-xs border border-primary text-primary font-medium font-family-roboto mb-8"
                        >
                            View Waiver (opens in new tab)
                        </a>
                        <div>
                            <p className="text-lg font-medium text-text-1 mb-3">Agreement</p>
                            <p className="text-sm text-text-1 mb-4">
                                By checking the box below, I acknowledge that I have read and understood the
                                volunteer liability waiver above. I voluntarily agree to its terms and conditions,
                                and I understand that this constitutes a legally binding agreement.
                            </p>

                            <label className="flex items-start gap-3 cursor-pointer mb-1">
                                <input
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={(e) => {
                                        setAgreed(e.target.checked);
                                        if (e.target.checked) setError(false);
                                    }}
                                    className="mt-0.5 w-4 h-4 shrink-0"
                                />
                                <span className="text-sm text-text-1">
                                    I have read, understood, and agree to the terms of the volunteer liability waiver.
                                </span>
                            </label>

                            {error && (
                                <p className="text-red-500 text-sm mt-2">
                                    You must check the box to agree before continuing.
                                </p>
                            )}

                            <button
                                onClick={handleContinue}
                                disabled={submitting}
                                className="mt-6 w-full h-10 rounded-xs bg-primary text-white font-medium font-family-roboto disabled:opacity-50"
                            >
                                {submitting ? "Submitting..." : "Continue"}
                            </button>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}
