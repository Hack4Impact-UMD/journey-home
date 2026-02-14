import { Timestamp } from "firebase/firestore";
import { DonationRequest } from "./donations";
import { ClientRequest } from "./client-requests";

export type TimeBlock = {
    id: string;
    task: Delivery | Pickup | null;
    startTime: Timestamp;
    endTime: Timestamp;
    volunteerIDs: string[];
    maxVolunteers: number;
    published: boolean;
};

export type Delivery = ClientRequest;
export type Pickup = DonationRequest;
