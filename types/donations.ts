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
    itemm: InventoryRecord, 
    status: "Not Reviewed" | "Approved" | "Denied" | "Acquired";
}

type DonationRequestData = {
    donor: DonorInfo,
    firstTimeDonor: boolean,
    howDidYouHear: string,
    canDropOff: boolean,
    notes: string,
    items: DonationItem[]
}