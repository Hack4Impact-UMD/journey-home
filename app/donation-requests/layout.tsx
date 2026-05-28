"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import Navbar from "@/components/general/Navbar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function DonationRequestsLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    return (
        <ProtectedRoute allow={["Admin"]}>
            <div className="h-full w-full flex flex-col font-family-roboto overflow-hidden">
                <div className="flex flex-1 min-h-0 max-md:flex-col">
                    <Navbar pageTitle="Donation Requests" />
                    <div className="flex-1 min-h-0 bg-[#F7F7F7] pt-8 max-md:pt-1 pb-4 px-6 flex flex-col max-md:bg-transparent max-md:p-0">
                        <span className="text-2xl text-primary font-extrabold block max-md:hidden">
                            Donation Requests
                        </span>
                        <div className="flex gap-8 text-sm">
                            <Link
                                className={`py-4${
                                    pathname.startsWith("/donation-requests/new")
                                        ? " border-b-2 border-primary text-primary"
                                        : ""
                                }`}
                                href="/donation-requests/new"
                                suppressHydrationWarning
                            >
                                New
                            </Link>
                            <Link
                                className={`py-4${
                                    pathname.startsWith("/donation-requests/reviewed")
                                        ? " border-b-2 border-primary text-primary"
                                        : ""
                                }`}
                                href="/donation-requests/reviewed"
                                suppressHydrationWarning
                            >
                                Reviewed
                            </Link>
                        </div>
                        <div className="bg-background rounded-xl my-2 flex-1 py-4 px-6 min-h-0 overflow-hidden flex flex-col max-md:bg-transparent max-md:m-0 max-md:rounded-none">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
