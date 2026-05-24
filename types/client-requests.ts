import { Timestamp } from "firebase/firestore";
import { LocationContact, ReviewStatus } from "./general";

export type YesNoUnsure = "Yes" | "No" | "Unsure";

export type ClientRequest = {
    id: string,
    client: Client,
    caseManagerID: string,
    notes: string,
    status: ReviewStatus
    items: ItemRequest[],
    associatedTimeBlockID: string | null
    date: Timestamp
};

export type Client = LocationContact & {
    hmis: string,
    programName: string,
    secondaryContact: ClientSecondaryContact,
    questions: ClientQuestions
}

export type ClientSecondaryContact = {
    name: string,
    relationship: string,
    phone: string
}

export type ClientQuestions = {
    clientSpeaksEnglish?: boolean,
    adultsInFamily?: number,
    childrenInFamily?: number,
    isVeteran?: YesNoUnsure,
    canPickUp?: boolean,
    wasChronic?: YesNoUnsure,
    hasMovedIn?: boolean,
    moveInDate: Timestamp | null,
    hasElevator?: boolean,
    notes?: string
}

export type ItemRequest = {
    name: string,
    quantity: number
}
