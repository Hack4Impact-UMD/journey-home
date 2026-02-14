"use client";

import { Package, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryStock {
    category: string;
    count: number;
    maxCount: number;
    color: string;
}

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
    categoryStocks: CategoryStock[];
}

export function StockSidebar({
    isOpen,
    onClose,
    onOpen,
    categoryStocks,
}: SidebarProps) {
    return (
        <>
            {/* Background of screen (when sidebar is open or closed) */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
                )}
                onClick={onClose}
            />

            {/* Floating toggle button */}
            {!isOpen && (
                <button
                    onClick={onOpen}
                    className="fixed top-1/2 right-0 -translate-y-1/2 bg-primary text-white px-2 py-3 rounded-l-lg shadow-lg z-50 hover:bg-primary/90 transition-colors"
                    aria-label="Open stock sidebar"
                >
                    <div className="flex flex-col items-center gap-1">
                        <Package className="w-5 h-5" />
                    </div>
                </button>
            )}

            {/* Sidebar Contents */}
            <div
                className={cn(
                    "fixed top-0 right-0 h-full bg-white shadow-xl z-50 transition-transform duration-300 ease-in-out flex flex-col w-[15rem]",
                    isOpen ? "translate-x-0" : "translate-x-full",
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2 border-b">
                    <div className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        <h2 className="text-base font-medium">Stock</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                        aria-label="Close sidebar"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Content of Sidebar */}
                <div className="flex-1 overflow-y-auto px-4 py-3">
                    <div className="space-y-3">
                        {categoryStocks.map((stock) => {
                            const percentage = stock.maxCount >0 ?
                                (stock.count / stock.maxCount) * 100 : 0;
                            return (
                                <div key={stock.category} className="space-y-1">
                                    {/* Text identifier */}
                                    <div className="flex items-center justify-between text-sm">
                                        <p>{stock.category}</p>
                                        <p>{stock.count}</p>
                                    </div>
                                    {/* Bar tool */}
                                    <div className="w-full h-2 bg-[#F5F5F5] rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-300"
                                            style={{
                                                width: `${percentage}%`,
                                                backgroundColor: stock.color,
                                            }}
                                        ></div>
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
