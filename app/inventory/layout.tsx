"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import SideNavbar from "@/components/general/SideNav";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function InventoryLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    return (
        <ProtectedRoute allow={["Admin"]}>
            <div className="h-full w-full flex flex-col font-family-roboto">
                <div className="flex flex-1">
                    <SideNavbar />
                    <div className="flex-1 bg-[#F7F7F7] py-8 px-16 flex flex-col">
                        <span className="text-2xl text-primary font-extrabold block">
                            Inventory
                        </span>
                        <div className="flex gap-8 text-sm">
                            <Link
                                className={`py-4${
                                    pathname.startsWith("/inventory/items")
                                        ? " border-b-2 border-primary text-primary"
                                        : ""
                                }`}
                                href="/inventory/items"
                                suppressHydrationWarning
                            >
                                Items
                            </Link>
                            <Link
                                className={`py-4${
                                    pathname.startsWith("/inventory/changelog")
                                        ? " border-b-2 border-primary text-primary"
                                        : ""
                                }`}
                                href="/inventory/changelog"
                                suppressHydrationWarning
                            >
                                Changelog
                            </Link>
                        </div>
                        <div className="bg-background rounded-xl flex-wrap my-2 flex-1 py-4 px-6 min-h-0 overflow-hidden">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}