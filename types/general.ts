export type Address = {
    streetAddress: string,
    city: string,
    state: string,
    zipCode: string
}

// General contacts that don't need an Address
export type ContactInfo = {
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string
}

// Contacts that need an address associated
export type LocationContact = ContactInfo & {address: Address}

export type ReviewStatus = "Not Reviewed" | "Approved" | "Denied"
