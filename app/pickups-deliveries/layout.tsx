"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import SideNavbar from "@/components/general/SideNav";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function PickupsDeliveriesLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    return (
        <ProtectedRoute allow={["Admin"]}>
            <div className="h-full w-full flex flex-col font-family-roboto overflow-hidden">
                <div className="flex flex-1 min-h-0">
                    <SideNavbar pageTitle="Pickups & Deliveries" />
                    <div className="flex-1 min-h-0 bg-[#F7F7F7] pt-8 max-md:pt-14 pb-4 px-6 flex flex-col">
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
                        </div>
                        <div className="bg-background rounded-xl my-2 flex-1 py-4 px-6 min-h-0 overflow-hidden flex flex-col">
                            { children }
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
