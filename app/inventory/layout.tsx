"use client";

import SideNavbar from "@/components/SideNav";
import StockSidebar from "@/components/StockSidebar";
import TopNavbar from "@/components/TopNav";
import { ReactNode } from "react";

export default function InventoryLayout({ children }: { children: ReactNode }) {
    return (
        <>  
            <div className="h-screen w-full flex flex-col  overflow-hidden">
                <TopNavbar/>
                <div className="flex flex-1 min-h-0">
                    <SideNavbar/>
                    <div className="flex-1 bg-[#F7F7F7] py-4 px-6 flex flex-col min-h-0">
                        <span className="text-4xl text-primary font-extrabold block">Inventory</span>
                        <div className="flex gap-8 text-xl">
                            <a className="py-4 border-b-2 border-primary text-primary" href="/inventory/warehouse">Warehouse</a>
                            <a className="py-4" href="/inventory/donation-requests">Donation Requests</a>
                            <a className="py-4" href="/inventory/approved-donations">Approved Donations</a>
                            <a className="py-4" href="/inventory/denied-donations">Denied Donations</a>
                        </div>
                        <div className="bg-background rounded-xl my-2 flex-1 py-4 px-6 min-h-0 overflow-hidden">
                            { children }
                        </div>
                    </div>
                    <StockSidebar/>
                </div>
            </div>
        </>
    );
}
