"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import SideNavbar from "@/components/general/SideNav";
import TopNavbar from "@/components/general/TopNav";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function PickupsDeliveriesLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    return (
        <ProtectedRoute allow={["Admin"]}>
            <div className="h-full w-full flex flex-col font-family-roboto">
                <TopNavbar />
                <div className="flex flex-1">
                    <SideNavbar />
                    <div className="flex-1  bg-[#F7F7F7] py-4 px-6 flex flex-col">
                        <span className="text-2xl text-primary font-extrabold block">
                            Pickups and Deliveries
                        </span>
                        <div className="flex gap-8 text-sm">
                            <Link
                                className={`py-4${
                                    pathname.startsWith("/pickups-deliveries/unscheduled")
                                        ? " border-b-2 border-primary text-primary"
                                        : ""
                                }`}
                                href="/pickups-deliveries/unscheduled"
                                suppressHydrationWarning
                            >
                                Unscheduled
                            </Link>
                            <Link
                                className={`py-4${
                                    pathname.startsWith(
                                        "/pickups-deliveries/scheduled"
                                    )
                                        ? " border-b-2 border-primary text-primary"
                                        : ""
                                }`}
                                href="/pickups-deliveries/scheduled"
                                suppressHydrationWarning
                            >
                                Scheduled
                            </Link>
                            <Link
                                className={`py-4${
                                    pathname.startsWith(
                                        "/pickups-deliveries/completed"
                                    )
                                        ? " border-b-2 border-primary text-primary"
                                        : ""
                                }`}
                                href="/pickups-deliveries/completed"
                                suppressHydrationWarning
                            >
                                Completed
                            </Link>
                            <Link
                                className={`py-4${
                                    pathname.startsWith(
                                        "/pickups-deliveries/calendar"
                                    )
                                        ? " border-b-2 border-primary text-primary"
                                        : ""
                                }`}
                                href="/pickups-deliveries/calendar"
                                suppressHydrationWarning
                            >
                                Calendar
                            </Link>
                        </div>
                        <div className="bg-background rounded-xl flex-wrap my-2 flex-1 py-4 px-6 min-h-0 overflow-hidden">
                            { children }
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
