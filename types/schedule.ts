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

// What volunteers may read. `tasks` embeds whole donation and client requests, so
// it lives in an admin-only collection and never reaches a volunteer's browser.
export type VolunteerTimeBlock = Omit<TimeBlock, "tasks">;

// Shown to visitors without an active volunteer account. Also drops the notes and
// the volunteer ids.
export type PublicTimeBlock = {
    id: string;
    name: string;
    type: TimeBlock["type"];
    startTime: Timestamp;
    endTime: Timestamp;
    published: boolean;
    volunteerGroups: PublicVolunteerGroup[];
};

export function isVolunteerTimeBlock(tb: VolunteerTimeBlock | PublicTimeBlock): tb is VolunteerTimeBlock {
    return "notes" in tb;
}

export function volunteerGroupFilled(group: VolunteerGroup | PublicVolunteerGroup): number {
    return "filled" in group ? group.filled : group.volunterIDs.length;
}

export function toPublicTimeBlock(tb: VolunteerTimeBlock): PublicTimeBlock {
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
