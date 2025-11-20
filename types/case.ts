import { Timestamp } from "firebase/firestore";

export interface ClientAddress {
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface ClientInfo {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: ClientAddress;
}

export interface CaseItem {
    name: string;
}

export interface CaseManagerRequest {
    client: ClientInfo;
    attachedItems: CaseItem[];
    scheduledDate?: Timestamp | null;
    completed?: boolean;
}