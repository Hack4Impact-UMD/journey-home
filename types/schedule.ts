import { Timestamp } from "firebase/firestore";
import { DonationRequest } from "./donations";
import { ClientRequest } from "./client-requests";

export type TimeBlock = {
    id: string;
    tasks: Task[];
    startTime: Timestamp;
    endTime: Timestamp;
    volunteerIDs: string[];
    maxVolunteers: number;
    published: boolean;
};

export type Task = Pickup | Delivery;
export type Delivery = ClientRequest;
export type Pickup = DonationRequest;
