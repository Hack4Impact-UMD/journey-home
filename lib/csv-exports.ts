import { escapeCSVField } from "./utils";
import { ClientRequest } from "@/types/client-requests";
import { DonationRequest } from "@/types/donations";
import { LocationContact } from "@/types/general";
import { UserData } from "@/types/user";

function downloadCSV(filename: string, headers: string[], rows: string[][]): void {
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

export function exportUsers(users: UserData[]): void {
    const headers = ["First Name", "Last Name", "Role", "Email", "Phone Number"];
    const rows = users.map((u) =>
        [u.firstName, u.lastName, u.role, u.email, u.phone ?? ""].map(escapeCSVField)
    );
    downloadCSV("users.csv", headers, rows);
}

export function exportDonors(donors: LocationContact[]): void {
    const headers = [
        "First Name", "Last Name", "Email", "Phone Number",
        "Street Address", "City", "State", "Zip Code",
    ];
    const rows = donors.map((d) =>
        [
            d.firstName, d.lastName, d.email, d.phoneNumber,
            d.address.streetAddress, d.address.city, d.address.state, d.address.zipCode,
        ].map(escapeCSVField)
    );
    downloadCSV("donors.csv", headers, rows);
}

export function exportDonationRequests(requests: DonationRequest[], filename: string): void {
    const headers = [
        "First Name", "Last Name", "Email", "Phone Number",
        "Street Address", "Apt", "City", "State", "Zip Code",
        "First Time Donor", "Can Drop Off", "How Did You Hear", "Responded", "Notes",
        "Date Submitted", "Category", "Quantity", "Item Status",
    ];
    const rows = requests.flatMap((r) =>
        r.items.map((di) =>
            [
                r.donor.firstName, r.donor.lastName, r.donor.email, r.donor.phoneNumber,
                r.donor.address.streetAddress, r.donor.address.apt ?? "",
                r.donor.address.city, r.donor.address.state, r.donor.address.zipCode,
                r.firstTimeDonor ? "Yes" : "No",
                r.canDropOff ? "Yes" : "No",
                r.howDidYouHear,
                r.responded ? "Yes" : "No",
                r.notes,
                r.date.toDate().toLocaleDateString(),
                di.item.category, String(di.item.quantity), di.status,
            ].map(escapeCSVField)
        )
    );
    downloadCSV(filename, headers, rows);
}

function clientRequestBaseRow(r: ClientRequest): string[] {
    const q = r.client.questions;
    return [
        r.client.firstName, r.client.lastName, r.client.email, r.client.phoneNumber,
        r.client.address.streetAddress, r.client.address.apt ?? "",
        r.client.address.city, r.client.address.state, r.client.address.zipCode,
        r.client.hmis, r.client.programName,
        r.client.secondaryContact.name, r.client.secondaryContact.relationship, r.client.secondaryContact.phone,
        q.clientSpeaksEnglish != null ? (q.clientSpeaksEnglish ? "Yes" : "No") : "",
        q.adultsInFamily != null ? String(q.adultsInFamily) : "",
        q.childrenInFamily != null ? String(q.childrenInFamily) : "",
        q.isVeteran ?? "",
        q.canPickUp != null ? (q.canPickUp ? "Yes" : "No") : "",
        q.wasChronic ?? "",
        q.hasMovedIn != null ? (q.hasMovedIn ? "Yes" : "No") : "",
        q.moveInDate ? q.moveInDate.toDate().toLocaleDateString() : "",
        q.hasElevator != null ? (q.hasElevator ? "Yes" : "No") : "",
        q.notes ?? "",
    ];
}

const CLIENT_REQUEST_BASE_HEADERS = [
    "First Name", "Last Name", "Email", "Phone Number",
    "Street Address", "Apt", "City", "State", "Zip Code",
    "HMIS", "Program Name",
    "Secondary Contact Name", "Secondary Contact Relationship", "Secondary Contact Phone",
    "Speaks English", "Adults in Family", "Children in Family", "Is Veteran",
    "Can Pick Up", "Was Chronic", "Has Moved In", "Move In Date", "Has Elevator", "Client Notes",
];

export function exportClientRequestsAdmin(
    requests: ClientRequest[],
    accounts: UserData[],
    filename: string,
    includeStatus: boolean,
): void {
    const byId = new Map(accounts.map((u) => [u.uid, u]));
    const headers = [
        ...CLIENT_REQUEST_BASE_HEADERS,
        "Date Submitted",
        ...(includeStatus ? ["Status"] : []),
        "Case Manager", "Admin Notes", "Item Name", "Item Quantity",
    ];
    const rows = requests.flatMap((r) => {
        const cm = byId.get(r.caseManagerID);
        const base = [
            ...clientRequestBaseRow(r),
            r.date?.toDate().toLocaleDateString() ?? "",
            ...(includeStatus ? [r.status] : []),
            cm ? `${cm.firstName} ${cm.lastName}` : "",
            r.notes,
        ];
        return r.items.map((i) => [...base, i.name, String(i.quantity)].map(escapeCSVField));
    });
    downloadCSV(filename, headers, rows);
}

export function exportClientRequestsCaseManager(
    requests: ClientRequest[],
    filename: string,
    includeStatus: boolean,
): void {
    const headers = [
        ...CLIENT_REQUEST_BASE_HEADERS,
        "Date Submitted",
        ...(includeStatus ? ["Status"] : []),
        "Item Name", "Item Quantity",
    ];
    const rows = requests.flatMap((r) => {
        const base = [
            ...clientRequestBaseRow(r),
            r.date?.toDate().toLocaleDateString() ?? "",
            ...(includeStatus ? [r.status] : []),
        ];
        return r.items.map((i) => [...base, i.name, String(i.quantity)].map(escapeCSVField));
    });
    downloadCSV(filename, headers, rows);
}
