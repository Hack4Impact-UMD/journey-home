"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import Navbar from "@/components/general/Navbar";
import ShiftTaskSummary from "./ShiftTaskSummary";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function VolunteerHomePage() {
    const { state } = useAuth();
    const user = state.userData;

    const name = user?.firstName || "Volunteer";

    return (
        <ProtectedRoute allow={["Volunteer"]}>
            <div className="h-full w-full flex flex-col font-family-roboto">
                <div className="flex flex-1 min-h-0 max-md:flex-col">
                    <Navbar />
                    <div className="flex-1 overflow-y-auto bg-linear-to-r from-[#F8FDFE] to-[#DAF2F5] pt-14 max-md:pt-4 pb-4 px-14 max-md:px-6 flex flex-col gap-6 border-l border-light-border">
                        <span className="text-5xl font-semibold text-primary leading-none block">
                            Welcome, {name}!
                        </span>

                        {/* shift tasks */}
                        <div className="mt-3 md:border md:border-light-border md:rounded-[0.625rem] md:pt-6 md:pr-4 md:pb-5 md:pl-5 md:shadow-sm md:overflow-hidden md:bg-white">
                            <ShiftTaskSummary />
                        </div>

                        {/* volunteer blurb */}
                        <div className="mt-3 md:border md:border-light-border md:rounded-[0.625rem] md:pt-6 md:pr-4 md:pb-7 md:pl-5 md:shadow-sm md:overflow-hidden md:bg-white">
                            <h2 className="text-2xl font-semibold text-black leading-none">Volunteering for JourneyHome</h2>
                            <p className="text-sm font-bold text-text-1 mt-5">Be part of something that matters.</p>
                            <p className="text-sm text-text-1 mt-1">
                                Volunteering with Journey Home puts you at the center of the work — moving donations and getting essential items directly into the hands of families. It&apos;s hands-on, meaningful, and no experience is needed.
                            </p>
                            <p className="text-sm text-text-1 mt-3">
                                <span className="font-semibold">Warehouse shifts</span> take place at our facility, where you&apos;ll help sort and organize donated goods to keep our shelves stocked.<br /><br />
                                <span className="font-semibold">Pickup &amp; Delivery shifts</span> involve collecting donations from donors and bringing them to clients across the community.
                            </p>
                            <Link
                                href="/volunteer-signup"
                                className="mt-5 w-full md:w-85 h-8 bg-primary text-white text-sm font-family-roboto rounded-sm flex items-center justify-center"
                            >
                                Sign Up to Volunteer
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}