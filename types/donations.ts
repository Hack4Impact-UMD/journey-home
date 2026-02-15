import { Timestamp } from "firebase/firestore"
import { InventoryRecord } from "./inventory"
import { LocationContact, ReviewStatus } from "./general"

export type DonationItem = {
    item: InventoryRecord, 
    status: ReviewStatus;
}

export type DonationRequest = {
    id: string,
    donor: LocationContact,
    firstTimeDonor: boolean,
    howDidYouHear: string,
    canDropOff: boolean,
    notes: string,
    date: Timestamp,
    items: DonationItem[]
}

export type DonationSearchParams = {
  status: string[]
  sortBy: "Quantity" | "Date",
  ascending: boolean
};