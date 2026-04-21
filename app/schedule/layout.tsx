"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import SideNavbar from "@/components/general/SideNav";
import TopNavbar from "@/components/general/TopNav";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
// import "react-big-calendar/lib/css/react-big-calendar.css";
import '../../styles/globals.scss';

export default function ScheduleLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    return (
        <ProtectedRoute allow={["Admin"]}>
            <div className="h-full w-full flex flex-col font-family-roboto">
                <TopNavbar />
                <div className="flex flex-1">
                    <SideNavbar />
                    <div className="flex-1  bg-[#F7F7F7] py-4 px-6 flex flex-col">
                        <span className="text-2xl text-primary font-extrabold block">
                            Schedule
                        </span>
                        <div className="flex gap-8 text-sm">
                            <Link
                                className={`py-4${
                                    pathname.startsWith("/schedule/calendar")
                                        ? " border-b-2 border-primary text-primary"
                                        : ""
                                }`}
                                href="/schedule/calendar"
                                suppressHydrationWarning
                            >
                                Calendar
                            </Link>
                            <Link
                                className={`py-4${
                                    pathname.startsWith(
                                        "/schedule/list"
                                    )
                                        ? " border-b-2 border-primary text-primary"
                                        : ""
                                }`}
                                href="/schedule/list"
                                suppressHydrationWarning
                            >
                                List View
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