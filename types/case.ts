import { InventoryRecord } from "./inventory";

export interface ClientAddress {
    street: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface ClientInfo {
    hmis: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: ClientAddress;
    // other fields can be added later
}

export interface CaseManagerRequest {
    id: string;
    client: ClientInfo;
    attachedItems: InventoryRecord[];
    otherItems: string[];
    // other fields can be added later
}