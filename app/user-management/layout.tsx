"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import SideNavbar from "@/components/SideNav";
import TopNavbar from "@/components/TopNav";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function UserManagementLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    return (
        <ProtectedRoute allow={["Admin"]}>
            <div className="h-full w-full flex flex-col font-family-roboto">
                <TopNavbar />
                <div className="flex flex-1">
                    <SideNavbar />
                    <div className="flex-1 bg-[#F7F7F7] py-4 px-6 flex flex-col">
                        <span className="text-2xl text-primary font-extrabold block font-family-roboto">
                            User Management
                        </span>
                        <div className="flex gap-8 text-sm">
                            <a
                                className={`py-4 font-family-roboto text-sm${
                                    pathname.startsWith("/user-management/all-accounts") || pathname === "/user-management"
                                        ? " border-b-2 border-primary text-primary"
                                        : ""
                                }`}
                                href="/user-management/all-accounts"
                                suppressHydrationWarning
                            >
                                All Accounts
                            </a>
                            <a
                                className={`py-4 font-family-roboto${
                                    pathname.startsWith("/user-management/previous-donors")
                                        ? " border-b-2 border-primary text-primary"
                                        : ""
                                }`}
                                href="/user-management/previous-donors"
                                suppressHydrationWarning
                            >
                                Past Donors
                            </a>
                            <a
                                className={`py-4 font-family-roboto${
                                    pathname.startsWith("/user-management/account-requests")
                                        ? " border-b-2 border-primary text-primary"
                                        : ""
                                }`}
                                href="/user-management/account-requests"
                                suppressHydrationWarning
                            >
                                Account Requests
                            </a>
                        </div>
                        <div className="bg-background rounded-xl my-2 flex-1 py-4 px-6">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

