import { Timestamp } from "firebase/firestore";
import { DonationRequest } from "./donations";
import { ClientRequest } from "./client-requests";

export type VolunteerGroup = {
    name: string;
    maxNum: number;
    volunterIDs: string[]; // user IDs of volunteers associated with this group
}

export type TimeBlock = {
    id: string;
    name: string;
    type: "Pickup/Delivery" | "Warehouse",
    notes: string;
    tasks: Task[];
    startTime: Timestamp;
    endTime: Timestamp;
    volunteerGroups: VolunteerGroup[];
    published: boolean;
};

export type Task = Pickup | Delivery;
export type Delivery = ClientRequest;
export type Pickup = DonationRequest;

export type PublicVolunteerGroup = {
    name: string;
    maxNum: number;
    filled: number;
};

// Shown on the public /volunteer page. Everything a visitor doesn't need is
// dropped — above all `tasks`, which embeds whole donation and client requests.
export type PublicTimeBlock = {
    id: string;
    name: string;
    type: TimeBlock["type"];
    startTime: Timestamp;
    endTime: Timestamp;
    published: boolean;
    volunteerGroups: PublicVolunteerGroup[];
};

export function isPrivateTimeBlock(tb: TimeBlock | PublicTimeBlock): tb is TimeBlock {
    return "tasks" in tb;
}

export function volunteerGroupFilled(group: VolunteerGroup | PublicVolunteerGroup): number {
    return "filled" in group ? group.filled : group.volunterIDs.length;
}

export function toPublicTimeBlock(tb: TimeBlock): PublicTimeBlock {
    return {
        id: tb.id,
        name: tb.name,
        type: tb.type,
        startTime: tb.startTime,
        endTime: tb.endTime,
        published: tb.published,
        volunteerGroups: tb.volunteerGroups.map((group) => ({
            name: group.name,
            maxNum: group.maxNum,
            filled: group.volunterIDs.length,
        })),
    };
}
