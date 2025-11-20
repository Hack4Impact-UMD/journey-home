"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { SearchBox } from "@/components/inventory/SearchBox";
import FilterDropdown from "@/components/pickups-deliveries/FilterDropdown";
import TypeFilterButtons, { FilterType } from "@/components/pickups-deliveries/TypeFilterButtons";
import PickupDeliveryCard, {
    PickupDeliveryCardData,
} from "@/components/pickups-deliveries/PickupDeliveryCard";

type TabType = "unscheduled" | "scheduled" | "completed";

// Mock data for testing
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
        onSchedule: () => console.log("Schedule pickup 1"),
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
        onSchedule: () => console.log("Schedule pickup 2"),
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
        onSchedule: () => console.log("Schedule delivery 1"),
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
        onSchedule: () => console.log("Reschedule pickup 4"),
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

    // Get data based on active tab
    const getDataForTab = (): PickupDeliveryCardData[] => {
        switch (activeTab) {
            case "unscheduled":
                return mockUnscheduledData;
            case "scheduled":
                return mockScheduledData;
            case "completed":
                return mockCompletedData;
            default:
                return [];
        }
    };

    // Filter data based on search and type filter
    const filteredData = getDataForTab().filter((item) => {
        // Search filter
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

        // Type filter
        if (filterType === "pickups" && item.type !== "pickup") return false;
        if (filterType === "deliveries" && item.type !== "delivery") return false;

        return true;
    });

    const handleSearch = () => {
        // Search is handled by filteredData
        console.log("Searching for:", searchQuery);
    };

    return (
        <div className="flex flex-col flex-1">
            {/* Tab Navigation */}
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

            {/* Main Content Area */}
            <div className="bg-background rounded-xl my-2 flex-1 py-4 px-6">
                {/* Search and Filters */}
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

                {/* Cards Grid */}
                <div className="flex flex-wrap gap-9 items-start">
                    {filteredData.length > 0 ? (
                        filteredData.map((item) => (
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

