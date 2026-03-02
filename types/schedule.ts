import { Timestamp } from "firebase/firestore";
import { DonationRequest } from "./donations";
import { ClientRequest } from "./client-requests";

export type TimeBlock = {
    id: string;
    tasks: Task[];
    start: Timestamp;      // was startTime
    end: Timestamp;        // was endTime
    volunteerIDs: string[];
    maxTasks: number;      // was maxVolunteers
    published: boolean;
    type: "Warehouse" | "Pickups / Deliveries";
};
export type MyEvent = { title: string; start: Date; end: Date };

export type Task = Pickup | Delivery;
export type Delivery = ClientRequest;
export type Pickup = DonationRequest;
