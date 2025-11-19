"use client";

import { useState, useEffect } from "react";
import { SearchBox } from "@/components/inventory/SearchBox";
import FilterDropdown from "@/components/pickups-deliveries/FilterDropdown";
import TypeFilterButtons, { FilterType } from "@/components/pickups-deliveries/TypeFilterButtons";
import PickupDeliveryCard from "@/components/pickups-deliveries/PickupDeliveryCard";
import { PickupOrDelivery, PickupDeliveryCardData, TabType } from "../../types/pickupsDeliveries";
import { getAllPickupsAndDeliveries } from "../../lib/services/pickupsDeliveries";

export default function PickupsDeliveriesPage() {
    const [activeTab, setActiveTab] = useState<TabType>("unscheduled");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<FilterType>("all");
    const [quantityFilter, setQuantityFilter] = useState<string>("");
    const [dateFilter, setDateFilter] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [allRequests, setAllRequests] = useState<PickupOrDelivery[]>([]);

    // Fetch pickups & deliveries
    useEffect(() => {
        setLoading(true);
        getAllPickupsAndDeliveries()
            .then(setAllRequests)
            .finally(() => setLoading(false));
    }, []);

    // Map PickupOrDelivery → PickupDeliveryCardData for the card
    const mapToCardData = (item: PickupOrDelivery): PickupDeliveryCardData => {
        const isPickup = "donor" in item.request; // type guard

        const clientInfo = isPickup ? item.request.donor : item.request.client;

        return {
            id: item.id,
            type: isPickup ? "pickup" : "delivery",
            name: `${clientInfo.firstName} ${clientInfo.lastName}`,
            email: clientInfo.email,
            phone: clientInfo.phoneNumber,
            address: {
                street: clientInfo.address.street || clientInfo.address.streetAddress,
                city: clientInfo.address.city,
                state: clientInfo.address.state,
                zipCode: clientInfo.address.zipCode,
            },
            items: isPickup
                ? item.request.items.map(i => i.item.name)
                : item.request.attachedItems.map(i => i.name),
            pickupDate: item.request.scheduledDate ? item.request.scheduledDate.toDate().toLocaleString() : undefined,
            onSchedule: undefined, // add schedule handler later
        };
    };

    // Filter by active tab (unscheduled, scheduled, completed)
    const filteredByTab = allRequests.filter((item) => {
        const scheduledDate = item.request.scheduledDate;
        const completed = item.request.completed || false;

        switch (activeTab) {
            case "unscheduled":
                return !scheduledDate;
            case "scheduled":
                return !!scheduledDate && !completed;
            case "completed":
                return completed;
            default:
                return true;
        }
    });

    // Filter by search & type
    const filteredRequests = filteredByTab.filter((item) => {
        // Type filter
        if (filterType === "pickups" && !("donor" in item.request)) return false;
        if (filterType === "deliveries" && !("client" in item.request)) return false;

        // Search filter
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const clientInfo = "donor" in item.request ? item.request.donor : item.request.client;
            const name = `${clientInfo.firstName} ${clientInfo.lastName}`.toLowerCase();
            const email = clientInfo.email.toLowerCase();
            const phone = clientInfo.phoneNumber;
            const address = `${clientInfo.address.street || clientInfo.address.streetAddress} ${clientInfo.address.city} ${clientInfo.address.state} ${clientInfo.address.zipCode}`.toLowerCase();
            const items = "donor" in item.request
                ? item.request.items.map(i => i.item.name.toLowerCase()).join(" ")
                : item.request.attachedItems.map(i => i.name.toLowerCase()).join(" ");

            if (!(name.includes(q) || email.includes(q) || phone.includes(searchQuery) || address.includes(q) || items.includes(q))) {
                return false;
            }
        }

        return true;
    });

    return (
        <div className="flex flex-col flex-1">
            {/* Tabs */}
            <div className="flex gap-8 text-sm">
                {["unscheduled", "scheduled", "completed"].map(tab => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab as TabType)}
                        className={`py-4 ${activeTab === tab ? "border-b-2 border-primary text-primary" : ""}`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Filters & Search */}
            <div className="bg-background rounded-xl my-2 flex-1 py-4 px-6">
                <div className="flex gap-3 items-center mb-6">
                    <SearchBox value={searchQuery} onChange={setSearchQuery} onSubmit={() => {}} />
                    <FilterDropdown label="Qnt" options={["Ascending", "Descending"]} value={quantityFilter} onChange={setQuantityFilter} />
                    {(activeTab === "scheduled" || activeTab === "completed") && (
                        <FilterDropdown label="Date" options={["Newest", "Oldest"]} value={dateFilter} onChange={setDateFilter} />
                    )}
                    <TypeFilterButtons activeFilter={filterType} onFilterChange={setFilterType} />
                </div>

                {/* Cards */}
                <div className="flex flex-wrap gap-9 items-start">
                    {loading ? (
                        <div className="w-full text-center py-8">Loading...</div>
                    ) : filteredRequests.length > 0 ? (
                        filteredRequests.map(req => (
                            <PickupDeliveryCard key={req.id} data={mapToCardData(req)} />
                        ))
                    ) : (
                        <div className="w-full py-8 text-center text-text-2">
                            No pickups or deliveries found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}