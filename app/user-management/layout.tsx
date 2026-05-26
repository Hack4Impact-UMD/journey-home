"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import Navbar from "@/components/general/Navbar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Upload } from "lucide-react";
import { ExportProvider, useExport } from "@/contexts/ExportContext";

function ExportActions() {
    const { hasExport, triggerExport } = useExport();

    if (!hasExport) return null;

    return (
        <div className="flex items-center gap-2 shrink-0">
            <button
                type="button"
                className="bg-primary text-white px-3 py-1.5 text-sm flex items-center gap-1.5"
                onClick={triggerExport}
            >
                <Upload size={16} />
                Export
            </button>
        </div>
    );
}

export default function UserManagementLayout({
    children,
}: {
    children: ReactNode;
}) {
    const pathname = usePathname();

    return (
        <ProtectedRoute allow={["Admin"]}>
            <ExportProvider>
                <div className="h-full w-full flex flex-col font-family-roboto overflow-hidden">
                    <div className="flex flex-1 min-h-0 max-md:flex-col">
                        <Navbar pageTitle="User Management" />
                        <div className="flex-1 min-h-0 bg-[#F7F7F7] pt-8 max-md:pt-1 pb-4 px-6 flex flex-col max-md:bg-transparent max-md:p-0">
                            <span className="text-2xl text-primary font-extrabold block max-md:hidden font-family-roboto">
                                User Management
                            </span>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex gap-8">
                                    <Link
                                        className={`py-4 font-family-roboto text-sm${
                                            pathname.startsWith("/user-management/all-accounts") || pathname === "/user-management"
                                                ? " border-b-2 border-primary text-primary"
                                                : ""
                                        }`}
                                        href="/user-management/all-accounts"
                                        suppressHydrationWarning
                                    >
                                        All Accounts
                                    </Link>
                                    <Link
                                        className={`py-4 font-family-roboto${
                                            pathname.startsWith("/user-management/account-requests")
                                                ? " border-b-2 border-primary text-primary"
                                                : ""
                                        }`}
                                        href="/user-management/account-requests"
                                        suppressHydrationWarning
                                    >
                                        Account Requests
                                    </Link>
                                    <Link
                                        className={`py-4 font-family-roboto${
                                            pathname.startsWith("/user-management/past-donors")
                                                ? " border-b-2 border-primary text-primary"
                                                : ""
                                        }`}
                                        href="/user-management/past-donors"
                                        suppressHydrationWarning
                                    >
                                        Past Donors
                                    </Link>
                                </div>
                                <ExportActions />
                            </div>
                            <div className="bg-background rounded-xl my-2 flex-1 py-4 px-6 min-h-0 overflow-hidden flex flex-col max-md:bg-transparent max-md:m-0 max-md:rounded-none">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </ExportProvider>
        </ProtectedRoute>
    );
}
