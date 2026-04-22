"use client";

import { useState} from "react";
import CheckInOutFlow from "@/components/volunteer-tasks/CheckInOutFlow";
import AddButton from "@/components/volunteer-tasks/AddButton";

import { useInventoryCategories } from "@/lib/queries/inventory";
import { CheckOutInventory } from "@/components/icons/CheckOutInventory";

type ItemMap = Record<string, number>;

export default function VolunteerTasks() {
    const [view] = useState<"Screen3">("Screen3");
    const [screen, setScreen] = useState<"checkout" | "summary">("checkout");

    const [items, setItems] = useState<ItemMap>({});
    const [open, setOpen] = useState(false);

    const {
        inventoryCategories,
        setInventoryCategoryWithToast,
    } = useInventoryCategories();


    const handleAddItem = (item: { name: string; qty: number }) => {
        setItems((prev) => ({
            ...prev,
            [item.name]: (prev[item.name] || 0) + item.qty,
        }));
        setOpen(false);
    };
    const handleConfirm = async () => {
        for (const [name, qty] of Object.entries(items)) {
            const category = inventoryCategories.find((c) => c.name === name);
            if (!category) continue;
            await setInventoryCategoryWithToast({
                id: category.id,
                name: category.name,
                quantity: category.quantity - qty,
                lowThreshold: category.lowThreshold,
                highThreshold: category.highThreshold,
            });
        }
        setScreen("summary");
    };
    return (
        <div>
            {view === "Screen3" && (
                <div>
                    {screen === "checkout" && (
                        <>
                            <div className="flex justify-center">
                                <div className="flex flex-col items-center">
                                    <h1 className="text-[#02AFC7] mb-[1em] font-bold">
                                        Check out of warehouse
                                    </h1>
                                    <CheckOutInventory/>
                                </div>
                            </div>
                            <p className="text-[#02AFC7] font-bold mt-4">Shift notes</p>
                            <p>INSERT TIME BLOCK TEXT HERE!!!!</p>
                            <p  className="text-[#02AFC7] font-bold mt-4">Check out of inventory</p>

                             {Object.keys(items).length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {Object.entries(items).map(([name, qty]) => (
                                        <div
                                            key={name}
                                            className="flex justify-between "
                                        >
                                            <span className="font-bold">{name}</span>
                                            <span>
                                                {qty}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <AddButton onClick={() => setOpen(true)} />
                            
                            <div className="flex flex-row gap-[1em] h-[4em] justify-center mt-auto ">
                                <button className="mt-6 w-full border border-gray">
                                    Back
                                </button>

                                {Object.keys(items).length > 0 && (
                                    <button
                                        onClick={() => setScreen("summary")}
                                        className="mt-6 w-full bg-[#02AFC7] text-white"
                                    >
                                        Next
                                    </button>
                                )}
                            </div>
                            {open && (
                           
                            <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center">
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
                             <div className="flex justify-center">
                                <div className="flex flex-col items-center">
                                    <h1 className="text-[#02AFC7] mb-[1em] font-bold">
                                        Summary
                                    </h1>
                                    <CheckOutInventory/>
                                </div>
                            </div>

                            {Object.keys(items).length === 0 ? (
                                <p className="text-gray-400">
                                    No items selected
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {Object.entries(items).map(([name, qty]) => (
                                        <div
                                            key={name}
                                            className="flex justify-between font-bold"
                                        >
                                            <span>{name}</span>
                                            <span className="text-[#02AFC7] font-semibold">
                                                {qty}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex flex-row gap-[1em] h-[4em] justify-center mt-auto ">
                                <button 
                                    onClick={() => setScreen("checkout")}
                                    className="mt-6 w-full border border-gray"
                                >
                                    Back
                                </button>

                                {Object.keys(items).length > 0 && (
                                    <button
                                        onClick={handleConfirm}
                                        className="mt-6 w-full bg-[#02AFC7] text-white"
                                    >
                                        Confirm
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}