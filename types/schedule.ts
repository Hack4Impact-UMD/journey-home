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

export type MyEvent = { title: string; start: Date; end: Date };

export type Task = Pickup | Delivery;
export type Delivery = ClientRequest;
export type Pickup = DonationRequest;
