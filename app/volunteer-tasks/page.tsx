"use client";

import { useState, useMemo } from "react";
import CheckInOutFlow from "@/components/volunteer-tasks/CheckInOutFlow";
import AddButton from "@/components/volunteer-tasks/AddButton";

import { useInventoryCategories } from "@/lib/queries/inventory";

type ItemMap = Record<string, number>;

export default function VolunteerTasks() {
    const [view] = useState<"Screen3">("Screen3");
    const [screen, setScreen] = useState<"checkout" | "summary">("checkout");

    const [items, setItems] = useState<ItemMap>({});
    const [open, setOpen] = useState(false);

    const {
        inventoryCategories,
        setInventoryCategoryWithToast,
        isLoading,
    } = useInventoryCategories();

    const inventoryMap = useMemo(() => {
        return new Map(
            inventoryCategories.map((item) => [
                item.name,
                item.quantity ?? 0,
            ])
        );
    }, [inventoryCategories]);

    const handleAddItem = async (item: { name: string; qty: number }) => {
    setItems((prev) => ({
        ...prev,
        [item.name]: (prev[item.name] || 0) + item.qty,
    }));


    setOpen(false);

    const currentQty = inventoryMap.get(item.name) ?? 0;

    await setInventoryCategoryWithToast({
        id: item.name,
        name: item.name,
        quantity: currentQty + item.qty,
        lowThreshold: 0,
        highThreshold: 9999,
    });
};
    return (
        <div>
            {view === "Screen3" && (
                <div>
                    {screen === "checkout" && (
                        <>
                            <h1 className="text-[#02AFC7]">
                                Checkout Inventory
                            </h1>

                            <AddButton onClick={() => setOpen(true)} />

    
                            {Object.keys(items).length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {Object.entries(items).map(([name, qty]) => (
                                        <div
                                            key={name}
                                            className="flex justify-between bg-white p-3 rounded-lg shadow"
                                        >
                                            <span>{name}</span>
                                            <span className="text-[#02AFC7] font-semibold">
                                                {qty}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {Object.keys(items).length > 0 && (
                                <button
                                    onClick={() => setScreen("summary")}
                                    className="mt-6 w-full bg-[#02AFC7] text-white py-3 rounded-full"
                                >
                                    Next
                                </button>
                            )}

                            {open && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                                    <div className="w-full max-w-md mx-auto">
                                        <CheckInOutFlow
                                            onClose={() => setOpen(false)}
                                            onAddItem={handleAddItem}
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {screen === "summary" && (
                        <>
                            <h1 className="text-[#02AFC7] mb-4">
                                Summary
                            </h1>

                            {Object.keys(items).length === 0 ? (
                                <p className="text-gray-400">
                                    No items selected
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {Object.entries(items).map(([name, qty]) => (
                                        <div
                                            key={name}
                                            className="flex justify-between bg-white p-4 rounded-xl shadow"
                                        >
                                            <span>{name}</span>
                                            <span className="text-[#02AFC7] font-semibold">
                                                {qty}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={() => setScreen("checkout")}
                                className="mt-6 w-full bg-gray-200 py-3 rounded-full"
                            >
                                Back
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}