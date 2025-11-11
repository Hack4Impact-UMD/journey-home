"use client";

import SideNavbar from "@/components/SideNav";
import StockSidebar from "@/components/StockSidebar";
import TopNavbar from "@/components/TopNav";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function InventoryLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    return (
        <>  
            <div className="h-screen w-full flex flex-col  font-family-roboto overflow-hidden">
                <TopNavbar/>
                <div className="flex flex-1 min-h-0">
                    <SideNavbar/>
                    <div className="flex-1 bg-[#F7F7F7] py-4 px-6 flex flex-col min-h-0">
                        <span className="text-2xl text-primary font-extrabold block">Inventory</span>
                        <div className="flex gap-8 text-sm">
                            <a
                                className={`py-4${
                                    pathname.startsWith("/inventory/warehouse")
                                        ? " border-b-2 border-primary text-primary"
                                        : ""
                                }`}
                                href="/inventory/warehouse"
                                suppressHydrationWarning
                            >
                                Warehouse
                            </a>
                            <a
                                className={`py-4${
                                    pathname.startsWith(
                                        "/inventory/donation-requests"
                                    )
                                        ? " border-b-2 border-primary text-primary"
                                        : ""
                                }`}
                                href="/inventory/donation-requests"
                                suppressHydrationWarning
                            >
                                Donation Requests
                            </a>
                            <a
                                className={`py-4${
                                    pathname.startsWith(
                                        "/inventory/approved-donations"
                                    )
                                        ? " border-b-2 border-primary text-primary"
                                        : ""
                                }`}
                                href="/inventory/approved-donations"
                                suppressHydrationWarning
                            >
                                Approved Donations
                            </a>
                            <a
                                className={`py-4${
                                    pathname.startsWith(
                                        "/inventory/denied-donations"
                                    )
                                        ? " border-b-2 border-primary text-primary"
                                        : ""
                                }`}
                                href="/inventory/denied-donations"
                                suppressHydrationWarning
                            >
                                Denied Donations
                            </a>
                        </div>
                        <div className="bg-background rounded-xl flex-wrap my-2 flex-1 py-4 px-6 min-h-0 overflow-hidden">
                            { children }
                        </div>
                    </div>
                    <StockSidebar/>
                </div>
            </div>
        </>
    );
}
