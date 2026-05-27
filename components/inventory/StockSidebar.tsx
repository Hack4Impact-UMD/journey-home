"use client";

import { useState } from "react";
import { Package, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PresetIcon } from "@/components/icons/PresetIcon";
import { getAllInventoryCategories } from "@/lib/services/inventory";
import { InventoryCategory } from "@/types/inventory";
import { toast } from "sonner";

export function StockSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState<InventoryCategory[]>([]);

    const handleOpen = () => {
        setIsOpen(true);
        setCategories([]);
        getAllInventoryCategories()
            .then(setCategories)
            .catch(() => toast.error("Failed to load stock data"));
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
            icon: cat.icon,
            count: cat.quantity,
            maxCount: cat.highThreshold,
            color,
        };
    });

    const sortedStocks = [...categoryStocks].sort((a, b) =>
        a.category.localeCompare(b.category),
    );

    return (
        <>
            <div
                className={cn(
                    "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
                )}
                onClick={() => setIsOpen(false)}
            />

            <div
                className={cn(
                    "fixed top-0 right-0 h-full bg-white shadow-2xl z-50 transition-transform duration-500 ease-in-out flex flex-col w-[18rem]",
                    isOpen ? "translate-x-0" : "translate-x-full",
                )}
            >
                {!isOpen && (
                    <button
                        onClick={handleOpen}
                        aria-label="Open stock sidebar"
                        className="absolute inset-y-0 -left-10 w-10 bg-white border-l border-gray-200 shadow-[-5px_0_15px_rgba(0,0,0,0.05)] flex flex-col items-center py-4 gap-4"
                    >
                        <Package className="w-5 h-5" />
                    </button>
                )}

                <div className="flex items-center justify-between px-4 pt-4 pb-2">
                    <div className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        <h2 className="text-base font-medium">Stock</h2>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className=""
                        aria-label="Close sidebar"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-3">
                    <div className="space-y-3">
                        {sortedStocks.map((stock) => {
                            const percentage =
                                stock.maxCount > 0
                                    ? (stock.count / stock.maxCount) * 100
                                    : 0;

                            return (
                                <div key={stock.category} className="space-y-1.5">
                                    <div className="flex items-center gap-1">
                                        <PresetIcon icon={stock.icon} className="w-4 h-4 shrink-0" />
                                        <p className="text-sm">{stock.category}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-51 h-2 bg-[#F5F5F5] rounded-full overflow-hidden shrink-0">
                                            <div
                                                className="h-full rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${Math.min(percentage, 100)}%`,
                                                    backgroundColor: stock.color,
                                                }}
                                            />
                                        </div>
                                        <p className="text-sm">{stock.count}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
