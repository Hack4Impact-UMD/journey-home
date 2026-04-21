"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import SideNavbar from "@/components/general/SideNav";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function ClientRequestsLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const { state: authState } = useAuth();
    const role = authState.userData?.role === "Admin" ? "admin" : "case-manager";

    return (
        <ProtectedRoute allow={["Admin", "Case Manager"]}>
            <div className="h-full w-full flex flex-col font-family-roboto overflow-hidden">
                <div className="flex flex-1 min-h-0">
                    <SideNavbar />
                    <div className="flex-1 min-h-0 bg-[#F7F7F7] pt-8 pb-4 px-6 flex flex-col">
                        <span className="text-2xl text-primary font-extrabold block">
                            Client Requests
                        </span>
                        <div className="flex gap-8 text-sm">
                            <Link
                                className={`py-4${
                                    pathname.startsWith(`/client-requests/${role}/new`)
                                        ? " border-b-2 border-primary text-primary"
                                        : ""
                                }`}
                                href={`/client-requests/${role}/new`}
                                suppressHydrationWarning
                            >
                                New
                            </Link>
                            <Link
                                className={`py-4${
                                    pathname.startsWith(`/client-requests/${role}/reviewed`)
                                        ? " border-b-2 border-primary text-primary"
                                        : ""
                                }`}
                                href={`/client-requests/${role}/reviewed`}
                                suppressHydrationWarning
                            >
                                Reviewed
                            </Link>
                        </div>
                        <div className="bg-background rounded-xl my-2 flex-1 py-4 px-6 min-h-0 overflow-hidden flex flex-col">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
