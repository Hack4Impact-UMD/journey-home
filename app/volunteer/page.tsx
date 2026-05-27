"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTimeBlocks } from "@/lib/queries/timeblocks";
import { DropdownMultiselect } from "@/components/inventory/DropdownMultiselect";
import ShiftListView from "@/components/schedule/ShiftListView";
import { ConfirmModal } from "@/components/general/ConfirmModal";
import { useAuth } from "@/contexts/AuthContext";

export default function VolunteerPage() {
    const router = useRouter();
    const { state: { currentUser, userData } } = useAuth();
    const { allTB: timeBlocks = [] } = useTimeBlocks();

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
                <p className="text-sm font-bold text-text-1 mt-3">
                    Be part of something that matters.
                </p>
                <p className="text-sm text-text-1 mt-1">
                    Volunteering with Journey Home puts you at the center of the work — moving donations and getting essential items directly into the hands of families. It&apos;s hands-on, meaningful, and no experience is needed.
                </p>
                <p className="text-sm text-text-1 mt-3">
                    <span className="font-semibold">Warehouse shifts</span> take place at our facility, where you&apos;ll help sort and organize donated goods to keep our shelves stocked.<br /><br /><span className="font-semibold">Pickup &amp; Delivery shifts</span> involve collecting donations from donors and bringing them to clients across the community.
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
                <ShiftListView
                    timeBlocks={filteredTimeBlocks}
                    currentUserID=""
                    onSignUpClick={handleSignUpClick}
                />
            </div>

            {showModal && (
                <ConfirmModal
                    title="Sign Up Required"
                    message="To sign up for a shift, you'll need an account. Confirm to create one now."
                    onConfirm={() => router.push("/signup")}
                    onCancel={() => setShowModal(false)}
                />
            )}
        </div>
    );
}
