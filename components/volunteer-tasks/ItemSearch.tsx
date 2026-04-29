"use client";

import { useState } from "react";
import BoxIcon from "../icons/BoxIcon";
import { SearchIcon } from "../icons/SearchIcon";
import { Badge } from "../inventory/Badge";
import { InventoryCategory } from "@/types/inventory";

type Props = {
    categories: InventoryCategory[];
    isLoading: boolean;
    isError: boolean;
    onAdd: (item: { name: string; qty: number }) => void;
    onClose: () => void;
    mode: "add" | "remove";
};

export default function ItemSearch({
    categories,
    isLoading,
    isError,
    onAdd,
    onClose,
    mode,
}: Props) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [quantity, setQuantity] = useState("");

    const filteredItems = !selectedItem
        ? searchQuery.trim()
            ? categories.filter((item) =>
                  item.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
            : categories
        : [];

    const handleAdd = () => {
        if (!selectedItem || !quantity) return;
        const qty = Number(quantity);
        if (!Number.isInteger(qty) || qty <= 0) return;

        onAdd({ name: selectedItem, qty });

        setSelectedItem(null);
        setQuantity("");
        setSearchQuery("");
    };

    return (
        <div className="fixed inset-0 flex items-end justify-center" onClick={onClose}>
            <div className="flex flex-col bg-white rounded-t-2xl p-6 w-full md:max-w-sm h-4/5 relative shadow-[0_-4px_6px_rgba(0,0,0,0.1)] animate-slide-up" onClick={(e) => e.stopPropagation()}>
                <p className="text-base font-family-roboto text-primary">{mode === "remove" ? "Remove from inventory" : "Add to inventory"}</p>

                {!selectedItem && (
                    <>
                        <div className="flex items-center border-b pt-4 pb-3 gap-2 shrink-0">
                            <SearchIcon />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search inventory"
                                className="flex-1 outline-none text-sm"
                            />
                        </div>

                        <div className="flex-1 min-h-0 overflow-y-auto">
                            {isLoading && <p className="px-4 py-2">Loading...</p>}
                            {isError && <p className="px-4 py-2 text-red-500">Error</p>}

                            {filteredItems.map((item) => {
                                const lowerName = item.name.toLowerCase();
                                const lowerQuery = searchQuery.toLowerCase();
                                const idx = lowerName.indexOf(lowerQuery);
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => setSelectedItem(item.name)}
                                        className="px-4 py-3 border-b cursor-pointer hover:bg-gray-50 text-sm font-normal"
                                    >
                                        {idx === -1 ? item.name : (
                                            <>
                                                {item.name.slice(0, idx)}
                                                <strong>{item.name.slice(idx, idx + searchQuery.length)}</strong>
                                                {item.name.slice(idx + searchQuery.length)}
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                {selectedItem && (
                    <>
                        <div className="flex items-center gap-2 border-b px-4 py-3">
                            <button onClick={() => setSelectedItem(null)}>←</button>
                            <Badge text={selectedItem} color="blue" />
                        </div>

                        <div className="flex items-center gap-3 px-4 py-3 border-b">
                            <BoxIcon />
                            <input
                                type="text"
                                inputMode="numeric"
                                value={quantity}
                                onChange={(e) => { if (/^\d*$/.test(e.target.value)) setQuantity(e.target.value); }}
                                placeholder="Quantity"
                                className="w-full outline-none"
                            />
                        </div>

                        {Number(quantity) > 0 && (
                            <div className="px-4 pt-4">
                                <button
                                    onClick={handleAdd}
                                    className="w-full h-8 bg-primary text-white rounded-sm"
                                >
                                    {mode === "add" ? "Add to Inventory" : "Remove from Inventory"}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
