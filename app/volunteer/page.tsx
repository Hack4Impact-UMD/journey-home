"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useTimeBlocks } from "@/lib/queries/timeblocks";
import { DropdownMultiselect } from "@/components/inventory/DropdownMultiselect";
import ShiftListView from "@/components/schedule/ShiftListView";
import { useAuth } from "@/contexts/AuthContext";

function SignInRequiredModal({ onLogin, onCreateAccount, onClose }: {
    onLogin: () => void;
    onCreateAccount: () => void;
    onClose: () => void;
}) {
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", onKey); };
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 font-family-roboto">
            <div className="absolute inset-0" onClick={onClose} />
            <div className="relative bg-white w-full max-w-md mx-4 px-8 py-7 flex flex-col rounded-xl shadow-lg">
                <h1 className="text-xl font-semibold text-gray-900">Volunteer account required</h1>
                <p className="text-sm text-[#8D8D8D] font-family-opensans mt-2">
                    To sign up for a shift, you need to be logged in to a Journey Home volunteer account.
                    If you don&apos;t have one yet, you can create one.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <button
                        onClick={onLogin}
                        className="flex-1 h-10 bg-primary text-white text-sm font-medium rounded-sm hover:opacity-90 transition-opacity"
                    >
                        Log In
                    </button>
                    <button
                        onClick={onCreateAccount}
                        className="flex-1 h-10 border border-primary text-primary text-sm font-medium rounded-sm hover:bg-primary/5 transition-colors"
                    >
                        Create Account
                    </button>
                </div>
                <button
                    onClick={onClose}
                    className="mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors self-center"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default function VolunteerPage() {
    const router = useRouter();
    const { state: { currentUser, userData } } = useAuth();
    const { allTB: timeBlocks = [], isLoading } = useTimeBlocks();

    const [selectedTypes, setSelectedTypes] = useState<string[]>(["Warehouse", "Pickups / Deliveries"]);
    const [selectedAvailability, setSelectedAvailability] = useState<string[]>(["Available", "Full"]);
    const [showModal, setShowModal] = useState(false);

    const handleSignUpClick = () => {
        if (currentUser && userData?.role === "Volunteer") {
            router.push("/volunteer-signup");
        } else if (currentUser && userData?.role === "Admin") {
            router.push("/schedule");
        } else {
            setShowModal(true);
        }
    };

    const now = new Date();

    const filteredTimeBlocks = timeBlocks.filter((tb) => {
        if (tb.startTime.toDate() < now) return false;
        if (!tb.published) return false;

        const type = tb.type === "Pickup/Delivery" ? "Pickups / Deliveries" : "Warehouse";
        const isAvailable = tb.volunteerGroups.some((g) => g.volunterIDs.length < g.maxNum);
        const availability = isAvailable ? "Available" : "Full";

        return selectedTypes.includes(type) && selectedAvailability.includes(availability);
    });

    return (
        <div className="flex flex-col items-center md:pt-23.5">
            <div className="md:hidden w-full px-4 py-4 flex items-center justify-center border-b border-gray-200">
                <span className="font-family-raleway font-semibold text-[2rem] text-primary">Journey</span>
                <span className="font-family-raleway font-semibold text-[2rem] text-secondary-1">Home</span>
            </div>

            <img
                src="/journey-home-logo.png"
                alt="Journey Home"
                className="hidden md:block h-[6em] w-[22em]"
            />

            <div className="w-full mt-6 md:mt-12 px-6.25 md:px-13.75">
                <h1 className="text-xl font-medium md:text-2xl md:font-bold text-primary font-raleway">
                    Volunteering for JourneyHome
                </h1>
                <p className="text-sm text-text-1 mt-3">
                    Welcome to Journey Home's Sign Up System for our weekly Volunteer Pickups, Deliveries, and Organizing Days! We are ending homelessness, please join us and sign up to help! 
                </p>
                <p className="text-sm text-text-1 mt-3">
                    All Organizing Days are at our warehouse at 595 New Park Ave., West Hartford - NOTE this is a NEW address as of August 2024!
                </p>
                <p className="text-sm text-text-1 mt-3">
                    Pick-up and delivery days typically also start at our warehouse on New Park Ave., but emails with the day's specific schedule will be sent out to all volunteers by the day before the event.  
                </p>

                <p className="text-sm text-text-1 mt-3">
                    To ensure you receive the day's schedule, <span className="font-bold underline">please sign up at least 24 hours in advance of your volunteer shift.</span>
                </p>

                <div className="md:hidden mt-6 border-b border-gray-200" />

                <h2 className="text-xl font-medium md:text-2xl md:font-bold text-primary font-raleway mt-6 md:mt-12">
                    Available Shifts
                </h2>

                <div className="flex flex-wrap gap-3 mt-4">
                    <DropdownMultiselect
                        label="Type"
                        options={["Warehouse", "Pickups / Deliveries"]}
                        selected={selectedTypes}
                        setSelected={setSelectedTypes}
                    />
                    <DropdownMultiselect
                        label="Availability"
                        options={["Available", "Full"]}
                        selected={selectedAvailability}
                        setSelected={setSelectedAvailability}
                    />
                </div>
            </div>

            <div className="w-full mt-5 pb-16 overflow-x-auto">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-5 h-5 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
                    </div>
                ) : (
                    <ShiftListView
                        timeBlocks={filteredTimeBlocks}
                        currentUserID=""
                        onSignUpClick={handleSignUpClick}
                    />
                )}
            </div>

            {showModal && createPortal(
                <SignInRequiredModal
                    onLogin={() => router.push("/login")}
                    onCreateAccount={() => router.push("/signup")}
                    onClose={() => setShowModal(false)}
                />,
                document.body
            )}
        </div>
    );
}
