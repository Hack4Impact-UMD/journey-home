import { DonationRequest } from "./donations";
import { CaseManagerRequest } from "./case";

export interface Pickup {
    id: string;
    request: DonationRequest;
}

export interface Delivery {
    id: string;
    request: CaseManagerRequest;
}

export type PickupOrDelivery = Pickup | Delivery;
export type TabType = "unscheduled" | "scheduled" | "completed";