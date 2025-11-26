import { PickupOrDelivery, Pickup, Delivery, TabType } from "@/types/pickupsDeliveries";
import { PickupDeliveryCardData } from "@/components/pickups-deliveries/PickupDeliveryCard";
import { Timestamp } from "firebase/firestore";
import { getAllTimeBlocks } from "@/lib/services/volunteerTimeBlocks";


export function isPickup(item: PickupOrDelivery): item is Pickup {
    return "request" in item && "donor" in (item as Pickup).request;
}

export function isDelivery(item: PickupOrDelivery): item is Delivery {
    return "request" in item && "client" in (item as Delivery).request;
}

export function formatTimestamp(timestamp: Timestamp): string {
    const date = timestamp.toDate();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear().toString().slice(-2);
    const hours = date.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    
    return `${month}/${day}/${year} ${displayHours}${ampm}`;
}

export function getTabForItem(item: PickupOrDelivery): TabType {
    if (isPickup(item)) {
        if (item.request.completed) return "completed";
        if (item.request.scheduledDate) return "scheduled";
        return "unscheduled";
    } else {
        if (item.request.completed) return "completed";
        if (item.request.scheduledDate) return "scheduled";
        return "unscheduled";
    }
}

export function transformToCardData(
    item: PickupOrDelivery,
    onSchedule?: (id: string) => void
): PickupDeliveryCardData {
    if (isPickup(item)) {
        const { request } = item;
        const donor = request.donor;
        
        return {
            id: item.id,
            type: "pickup",
            name: `${donor.firstName} ${donor.lastName}`,
            email: donor.email,
            phone: donor.phoneNumber,
            address: {
                street: donor.address.streetAddress,
                city: donor.address.city,
                state: donor.address.state,
                zipCode: donor.address.zipCode,
            },
            items: request.items.map((item) => item.item.name),
            pickupDate: request.scheduledDate 
                ? formatTimestamp(request.scheduledDate)
                : undefined,
            onSchedule: onSchedule ? () => onSchedule(item.id) : undefined,
        };
    } else {
        const { request } = item;
        const client = request.client;
        
        return {
            id: item.id,
            type: "delivery",
            name: `${client.firstName} ${client.lastName}`,
            email: client.email,
            phone: client.phoneNumber,
            address: {
                street: client.address.streetAddress,
                city: client.address.city,
                state: client.address.state,
                zipCode: client.address.zipCode,
            },
            items: request.attachedItems.map((item) => item.name),
            pickupDate: request.scheduledDate 
                ? formatTimestamp(request.scheduledDate)
                : undefined,
            onSchedule: onSchedule ? () => onSchedule(item.id) : undefined,
        };
    }
}

// Find which time block currently contains this task (for rescheduling)
export async function findCurrentBlockId(taskId: string): Promise<string | undefined> {
    const timeBlocks = await getAllTimeBlocks();
    
    for (const block of timeBlocks) {
        if (block.tasks?.some((task) => task.id === taskId)) {
            return block.id;
        }
    }
    
    return undefined;
}