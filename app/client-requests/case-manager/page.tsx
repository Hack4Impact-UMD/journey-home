"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import SideNavbar from "@/components/general/SideNav";
import TopNavbar from "@/components/general/TopNav";
import Link from "next/link";

export default function ClientRequestsCaseManagerPage() {
    return (
        <ProtectedRoute allow={["Case Manager"]}>
            <div className="h-full w-full flex flex-col font-family-roboto">
                <TopNavbar />
                <div className="flex flex-1">
                    <SideNavbar />
                    <div className="flex-1 bg-[#F7F7F7] py-4 px-6 flex flex-col">
                        <h1 className="text-2xl text-primary font-extrabold">
                            Client Requests
                        </h1>
                        <div className="mt-4">
                            <Link
                                href="/client-request-form"
                                className="bg-primary text-white text-sm px-4 py-2 rounded-xs"
                            >
                                Create Request
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
