import { Timestamp } from "firebase/firestore";
import { LocationContact, ReviewStatus } from "./general";


export type ClientRequest = {
    id: string,
    client: Client,
    caseManagerID: string,
    notes: string,
    status: ReviewStatus
    items: ItemRequest[]
};

export type Client = LocationContact & {
    hmis: string,
    secondaryContact: ClientSecondaryContact,
    questions: ClientQuestions
}

export type ClientSecondaryContact = {
    name: string,
    relationship: string,
    phone: string
}

export type ClientQuestions = {
    clientSpeaksEnglish: boolean | undefined,
    adultsInFamily: number | undefined,
    childrenInFamily: number | undefined,
    isVeteran: boolean | undefined,
    canPickUp: boolean | undefined,
    wasChronic: boolean | undefined,
    hasMovedIn: boolean | undefined,
    moveInDate: Timestamp | undefined,
    hasElevator: boolean | undefined,
    notes?: string //made optional
}

export type ItemRequest = {
    name: string,
    quantity: number
}
