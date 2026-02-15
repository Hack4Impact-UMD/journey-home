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
    clientSpeaksEnglish: boolean,
    adultsInFamily: number,
    childrenInFamily: number,
    isVeteran: boolean,
    canPickUp: boolean,
    wasChronic: boolean,
    hasMovedIn: boolean,
    moveInDate: Timestamp,
    hasElevator: boolean,
    notes: string
}

export type ItemRequest = {
    name: string,
    quantity: number
}
