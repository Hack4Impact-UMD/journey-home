"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import SideNavbar from "@/components/general/SideNav";
import TopNavbar from "@/components/general/TopNav";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { useState } from "react";
import {
    getAllWarehouseInventoryRecords,
    getCategoryAttributes,
} from "@/lib/services/inventory";
import { CategoryAttributes, InventoryRecord } from "@/types/inventory";
import { StockSidebar } from "@/components/inventory/StockSidebar";

export default function InventoryLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [allItems, setAllItems] = useState<InventoryRecord[]>([]);
    const [categoryAttributes, setCategoryAttributes] = useState<
        CategoryAttributes[]
    >([]);

    const handleSidebarOpen = () => {
        setIsSidebarOpen(true);
        getAllWarehouseInventoryRecords().then(setAllItems);
        getCategoryAttributes().then(setCategoryAttributes);
    };

    //Calculating category stocks using CategoryAttributes
    const categoryStocks = categoryAttributes.map((catAttr) => {
        const count = allItems
            .filter((item) => item.category === catAttr.name)
            .reduce((sum, item) => sum + item.quantity, 0);

        let color;
        if (count < catAttr.lowThreshold) {
            color = "#FF6B4A";
        } else if (count < catAttr.highThreshold) {
            color = "#F4DE13";
        } else {
            color = "#69C22E";
        }
        const maxCount = catAttr.highThreshold;

        return {
            category: catAttr.name,
            count: count,
            maxCount: maxCount,
            color,
        };
    });

    return (
        <ProtectedRoute allow={["Admin"]}>
            <div className="h-full w-full flex flex-col font-family-roboto">
                <TopNavbar />
                <div className="flex flex-1">
                    <SideNavbar />
                    <div className="flex-1  bg-[#F7F7F7] py-4 px-6 flex flex-col">
                        <span className="text-2xl text-primary font-extrabold block">
                            Inventory
                        </span>
                        <div className="flex gap-8 text-sm">
                            <Link
                                className={`py-4${
                                    pathname.startsWith("/inventory/warehouse")
                                        ? " border-b-2 border-primary text-primary"
                                        : ""
                                }`}
                                href="/inventory/warehouse"
                                suppressHydrationWarning
                            >
                                Warehouse
                            </Link>
                            <Link
                                className={`py-4${
                                    pathname.startsWith(
                                        "/inventory/donation-requests",
                                    )
                                        ? " border-b-2 border-primary text-primary"
                                        : ""
                                }`}
                                href="/inventory/donation-requests"
                                suppressHydrationWarning
                            >
                                Donation Requests
                            </Link>
                            <Link
                                className={`py-4${
                                    pathname.startsWith(
                                        "/inventory/reviewed-donations",
                                    )
                                        ? " border-b-2 border-primary text-primary"
                                        : ""
                                }`}
                                href="/inventory/reviewed-donations"
                                suppressHydrationWarning
                            >
                                Reviewed Donations
                            </Link>
                        </div>
                        <div className="bg-background rounded-xl flex-wrap my-2 flex-1 py-4 px-6 min-h-0 overflow-hidden">
                            {children}
                        </div>
                    </div>
                </div>
                <StockSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    onOpen={handleSidebarOpen}
                    categoryStocks={categoryStocks}
                />
            </div>
        </ProtectedRoute>
    );
}
