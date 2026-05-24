"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import Navbar from "@/components/general/Navbar";
import { ReactNode, useState } from "react";
import { getAllInventoryCategories } from "@/lib/services/inventory";
import { InventoryCategory } from "@/types/inventory";
import { StockSidebar } from "@/components/inventory/StockSidebar";

export default function InventoryLayout({ children }: { children: ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [categories, setCategories] = useState<InventoryCategory[]>([]);

    const handleSidebarOpen = () => {
        setIsSidebarOpen(true);
        getAllInventoryCategories().then(setCategories);
    };

    const categoryStocks = categories.map((cat) => {
        let color;
        if (cat.quantity < cat.lowThreshold) {
            color = "#FF6B4A";
        } else if (cat.quantity < cat.highThreshold) {
            color = "#F4DE13";
        } else {
            color = "#69C22E";
        }

        return {
            category: cat.name,
            count: cat.quantity,
            maxCount: cat.highThreshold,
            color,
        };
    });

    return (
        <ProtectedRoute allow={["Admin"]}>
            <div className="h-full w-full flex flex-col font-family-roboto overflow-hidden">
                <div className="flex flex-1 min-h-0 max-md:flex-col">
                    <Navbar pageTitle="Inventory" />
                    <div className="flex-1 min-h-0 bg-[#F7F7F7] pt-8 max-md:pt-1 pb-4 px-6 flex flex-col max-md:bg-transparent max-md:p-0">
                        <span className="text-2xl text-primary font-extrabold block max-md:hidden">
                            Inventory
                        </span>
                        <div className="bg-background rounded-xl my-2 flex-1 py-4 px-6 min-h-0 overflow-hidden flex flex-col max-md:bg-transparent max-md:m-0 max-md:rounded-none">
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
