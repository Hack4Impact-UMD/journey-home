import { Timestamp } from "firebase/firestore";
import { DonationRequest } from "./donations";
import { ClientRequest } from "./client-requests";

export type VolunteerGroup = {
    name: string;
    maxNum: number;
    volunterIDs: string[]; // user IDs of volunteers associated with this group
}
export type RecurrenceFrequency = "daily" | "weekly" | "biweekly" | "monthly";

export type RecurrenceRule = {
    frequency: RecurrenceFrequency;
    until: Timestamp
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
    seriesId: string;
    recurrence: RecurrenceRule | null;
};

export type Task = Pickup | Delivery;
export type Delivery = ClientRequest;
export type Pickup = DonationRequest;
