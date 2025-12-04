"use client";

import { useState } from "react";
import { SearchBox } from "@/components/inventory/SearchBox";
import FilterDropdown from "@/components/pickups-deliveries/FilterDropdown";
import TypeFilterButtons, { FilterType } from "@/components/pickups-deliveries/TypeFilterButtons";
import PickupDeliveryCard, {
    PickupDeliveryCardData,
} from "@/components/pickups-deliveries/PickupDeliveryCard";
import { TabType } from "@/types/pickupsDeliveries";
import { scheduleTask, getTimeBlock } from "@/lib/services/volunteerTimeBlocks";
import { setPickup, setDelivery, getPickupOrDelivery } from "@/lib/services/pickupsDeliveries";
import { isPickup } from "./utils";
import SchedulingModal from "@/components/donation-requests/SchedulingModal";

// MOCK DATA FOR DISPLAY
const mockUnscheduledData: PickupDeliveryCardData[] = [
    {
        id: "1",
        type: "pickup",
        name: "John Doe",
        email: "johndoe@gmail.com",
        phone: "6507724932",
        address: {
            street: "124 Maplewood Drive",
            city: "New Haven",
            state: "CT",
            zipCode: "06511",
        },
        items: ["Striped sofa", "Wooden chairs", "Office chair", "Coffee table"],
    },
    {
        id: "2",
        type: "pickup",
        name: "Martin Gouse",
        email: "martingouse@gmail.com",
        phone: "6507724932",
        address: {
            street: "124 Oakwood Drive",
            city: "Hartford",
            state: "CT",
            zipCode: "06511",
        },
        items: ["Leather sofa", "Patio chairs", "Queen mattress"],
    },
    {
        id: "3",
        type: "delivery",
        name: "Jessie Miller",
        email: "johndoe@gmail.com",
        phone: "6507724932",
        address: {
            street: "124 Maplewood Drive",
            city: "New Haven",
            state: "CT",
            zipCode: "06511",
        },
        items: [
            "Striped sofa",
            "Wooden chairs",
            "Office chair",
            "Coffee table",
            "Dining table",
            "Bookshelf",
            "Lamp",
            "Rug",
            "Mirror",
        ],
    },
];

const mockScheduledData: PickupDeliveryCardData[] = [
    {
        id: "4",
        type: "pickup",
        name: "John Doe",
        email: "johndoe@gmail.com",
        phone: "6507724932",
        address: {
            street: "124 Maplewood Drive",
            city: "New Haven",
            state: "CT",
            zipCode: "06511",
        },
        items: ["Striped sofa", "Wooden chairs", "Office chair", "Coffee table"],
        pickupDate: "1/2/25 10AM-1PM",
    },
];

const mockCompletedData: PickupDeliveryCardData[] = [
    {
        id: "5",
        type: "pickup",
        name: "John Doe",
        email: "johndoe@gmail.com",
        phone: "6507724932",
        address: {
            street: "124 Maplewood Drive",
            city: "New Haven",
            state: "CT",
            zipCode: "06511",
        },
        items: ["Striped sofa", "Wooden chairs", "Office chair", "Coffee table"],
        pickupDate: "1/2/25 10AM-1PM",
    },
];

export default function PickupsDeliveriesPage() {
    const [activeTab, setActiveTab] = useState<TabType>("unscheduled");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<FilterType>("all");
    const [quantityFilter, setQuantityFilter] = useState<string>("");
    const [dateFilter, setDateFilter] = useState<string>("");
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        itemId: string | null;
    }>({ isOpen: false, itemId: null });

    const handleSchedule = (itemId: string) => {
        setModalState({ isOpen: true, itemId });
    };

    // REAL FIREBASE SCHEDULING
    const handleSaveSchedule = async (blockId: string) => {
        if (!modalState.itemId) return;

        try {
            console.log("=== Starting Firebase Schedule ===");
            console.log("Block ID:", blockId);
            console.log("Item ID:", modalState.itemId);

            // Get the pickup/delivery from Firebase
            const item = await getPickupOrDelivery(modalState.itemId);
            if (!item) {
                console.error("Item not found in Firebase!");
                alert("Item not found. Make sure it exists in Firebase.");
                return;
            }
            console.log("Found item in Firebase:", item);

            // Schedule the task in the time block
            console.log("Calling scheduleTask...");
            await scheduleTask(blockId, item);
            console.log("scheduleTask complete");

            // Get the time block to get its start time
            console.log("Getting time block...");
            const timeBlock = await getTimeBlock(blockId);
            console.log("Got time block:", timeBlock);

            if (timeBlock) {
                // Update the pickup/delivery with the scheduled date
                if (isPickup(item)) {
                    console.log("Updating pickup in Firebase...");
                    const updatedRequest = {
                        ...item.request,
                        scheduledDate: timeBlock.start,
                    };
                    await setPickup({ ...item, request: updatedRequest });
                    console.log("Pickup updated in Firebase");
                } else {
                    console.log("Updating delivery in Firebase...");
                    const updatedRequest = {
                        ...item.request,
                        scheduledDate: timeBlock.start,
                    };
                    await setDelivery({ ...item, request: updatedRequest });
                    console.log("Delivery updated in Firebase");
                }
            }

            console.log("=== Schedule Complete ===");
            alert("✅ Successfully scheduled in Firebase!");
            setModalState({ isOpen: false, itemId: null });
        } catch (error) {
            console.error("=== ERROR ===");
            console.error("Error scheduling task:", error);
            console.error("Error message:", error instanceof Error ? error.message : "Unknown error");
            alert("❌ Failed to schedule. Check console for details.");
        }
    };

    // Get mock data based on active tab
    const getDataForTab = (): PickupDeliveryCardData[] => {
        switch (activeTab) {
            case "unscheduled":
                return mockUnscheduledData.map(item => ({
                    ...item,
                    onSchedule: () => handleSchedule(item.id)
                }));
            case "scheduled":
                return mockScheduledData.map(item => ({
                    ...item,
                    onSchedule: () => handleSchedule(item.id)
                }));
            case "completed":
                return mockCompletedData;
            default:
                return [];
        }
    };

    const filteredData = getDataForTab().filter((item) => {
        if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch =
                item.name.toLowerCase().includes(searchLower) ||
                item.email.toLowerCase().includes(searchLower) ||
                item.phone.includes(searchQuery) ||
                item.address.street.toLowerCase().includes(searchLower) ||
                item.items.some((itemName) =>
                    itemName.toLowerCase().includes(searchLower)
                );
            if (!matchesSearch) return false;
        }

        if (filterType === "pickups" && item.type !== "pickup") return false;
        if (filterType === "deliveries" && item.type !== "delivery") return false;

        return true;
    });

    const sortedData = [...filteredData].sort((a, b) => {
        if (quantityFilter === "Ascending") {
            return a.items.length - b.items.length;
        } else if (quantityFilter === "Descending") {
            return b.items.length - a.items.length;
        }
        return 0;
    });

    const handleSearch = () => {
        console.log("Searching for:", searchQuery);
    };

    return (
        <div className="flex flex-col flex-1">
            {/* REAL FIREBASE SCHEDULING MODAL */}
            <SchedulingModal
                isOpen={modalState.isOpen}
                onClose={() => setModalState({ isOpen: false, itemId: null })}
                onSchedule={handleSaveSchedule}
            />

            <div className="flex gap-8 text-sm">
                <button
                    type="button"
                    onClick={() => setActiveTab("unscheduled")}
                    className={`py-4 ${
                        activeTab === "unscheduled"
                            ? "border-b-2 border-primary text-primary"
                            : ""
                    }`}
                >
                    Unscheduled
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab("scheduled")}
                    className={`py-4 ${
                        activeTab === "scheduled"
                            ? "border-b-2 border-primary text-primary"
                            : ""
                    }`}
                >
                    Scheduled
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab("completed")}
                    className={`py-4 ${
                        activeTab === "completed"
                            ? "border-b-2 border-primary text-primary"
                            : ""
                    }`}
                >
                    Completed
                </button>
            </div>

            <div className="bg-background rounded-xl my-2 flex-1 py-4 px-6">
                <div className="flex gap-3 items-center mb-6">
                    <SearchBox
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onSubmit={handleSearch}
                    />
                    <FilterDropdown
                        label="Qnt"
                        options={["Ascending", "Descending"]}
                        value={quantityFilter}
                        onChange={setQuantityFilter}
                    />
                    {(activeTab === "scheduled" || activeTab === "completed") && (
                        <FilterDropdown
                            label="Date"
                            options={["Newest", "Oldest"]}
                            value={dateFilter}
                            onChange={setDateFilter}
                        />
                    )}
                    <TypeFilterButtons
                        activeFilter={filterType}
                        onFilterChange={setFilterType}
                    />
                </div>

                <div className="flex flex-wrap gap-9 items-start">
                    {sortedData.length > 0 ? (
                        sortedData.map((item) => (
                            <PickupDeliveryCard key={item.id} data={item} />
                        ))
                    ) : (
                        <div className="w-full py-8 text-center text-text-2">
                            No {activeTab} pickups or deliveries found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}