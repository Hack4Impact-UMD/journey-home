import { Timestamp } from "firebase/firestore"
import { InventoryRecord } from "./inventory"

export type DonorAddress = {
    streetAddress: string,
    city: string,
    state: string,
    zipCode: string
}

export type DonorInfo = {
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    address: DonorAddress
}

export type DonationItem = {
    item: InventoryRecord, 
    status: "Not Reviewed" | "Approved" | "Denied" | "Acquired";
}

export type DonationRequest = {
    id: string,
    donor: DonorInfo,
    firstTimeDonor: boolean,
    howDidYouHear: string,
    canDropOff: boolean,
    notes: string,
    date: Timestamp,
    items: DonationItem[]
}

export type DonationSearchParams = {
  status: string[]
  sortBy: "Quantity" | "Date" | "Name",
  ascending: boolean
};