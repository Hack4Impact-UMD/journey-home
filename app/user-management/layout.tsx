"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import SideNavbar from "@/components/general/SideNav";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Upload } from "lucide-react";
import { ExportProvider, useExport } from "@/contexts/UserExportContext";

function ExportActions() {
    const {onExport} = useExport();
    const pathname = usePathname();

    const isUserManagementPage =
        pathname.startsWith("/user-management/all-accounts") ||
        pathname.startsWith("/user-management/account-requests") ||
        pathname.startsWith("/user-management/past-donors");

    if (!isUserManagementPage || !onExport) return null;

    return (
        <div className="flex items-center gap-2 shrink-0">
            <button
                type="button"
                className="bg-primary text-white px-3 py-1.5 text-sm flex items-center gap-1.5"
                onClick={onExport}
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
                    <div className="flex flex-1 min-h-0">
                        <SideNavbar />

                        <div className="flex-1 min-h-0 bg-[#F7F7F7] pt-8 pb-4 px-6 flex flex-col">
                            <span className="text-2xl text-primary font-extrabold block font-family-roboto">
                                User Management
                            </span>

                            <div className="flex items-center justify-between text-sm mt-2 mb-2">
                                <div className="flex gap-8">
                                    <Link
                                        className={`py-4 font-family-roboto text-sm${
                                            pathname.startsWith("/user-management/all-accounts") ||
                                            pathname === "/user-management"
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

                            <div className="bg-background rounded-xl my-2 flex-1 py-4 px-6 min-h-0 overflow-hidden flex flex-col">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </ExportProvider>
        </ProtectedRoute>
    );
}