import { DonationRequest } from "./donations";
import { CaseManagerRequest } from "./case";
import { Timestamp } from "firebase/firestore";

export interface Pickup {
    id: string;
    request: DonationRequest;
}

export interface Delivery {
    id: string;
    request: CaseManagerRequest;
}

export type VolunteerTimeBlock = {
    id: string;
    start: Timestamp;
    end: Timestamp;
    tasks: PickupOrDelivery[];
    maxTasks: number;
};

export type PickupOrDelivery = Pickup | Delivery;
export type TabType = "unscheduled" | "scheduled" | "completed";