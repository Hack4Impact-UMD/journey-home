import { Timestamp } from "firebase/firestore"
import { InventoryRecord } from "./inventory"

type DonorAddress = {
    streetAddress: string,
    city: string,
    state: string,
    zipCode: string
}

type DonorInfo = {
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    address: DonorAddress
}

type DonationItem = {
    item: InventoryRecord, 
    status: "Not Reviewed" | "Approved" | "Denied" | "Acquired";
}

type DonationRequest = {
    donor: DonorInfo,
    firstTimeDonor: boolean,
    howDidYouHear: string,
    canDropOff: boolean,
    notes: string,
    date: Timestamp,
    items: DonationItem[]
}