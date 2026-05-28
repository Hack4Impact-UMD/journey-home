import { escapeCSVField } from "./utils";
import { ClientRequest } from "@/types/client-requests";
import { DonationRequest } from "@/types/donations";
import { LocationContact } from "@/types/general";
import { UserData } from "@/types/user";

function downloadCSV(filename: string, headers: string[], rows: string[][]): void {
    const now = new Date();
    const date = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).replace(":", ".");
    const timestamp = `${date} at ${time}`;
    const dotIndex = filename.lastIndexOf(".");
    const base = filename.slice(0, dotIndex === -1 ? undefined : dotIndex);
    const ext = dotIndex === -1 ? "" : filename.slice(dotIndex);
    const titledBase = base.split(/[-_]/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    const stampedFilename = `${titledBase} - ${timestamp}${ext}`;
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = stampedFilename;
    a.click();
    URL.revokeObjectURL(url);
}

export function exportUsers(users: UserData[]): void {
    const headers = [
        "First Name", "Last Name", "Role", "Email", "Phone Number",
        "Account Created", "Waiver Signed", "Disabled", "Email Verified",
    ];
    const rows = users
        .filter((u) => u.pending === null)
        .map((u) =>
            [
                u.firstName,
                u.lastName,
                u.role,
                u.email,
                u.phone ?? "",
                u.createdTime.toDate().toLocaleDateString(),
                u.signedWaiver ? u.signedWaiver.toDate().toLocaleString() : "",
                u.disabled ? "Yes" : "No",
                u.emailVerified ? "Yes" : "No",
            ].map(escapeCSVField)
        );
    downloadCSV("users.csv", headers, rows);
}

export function exportDonors(donors: LocationContact[]): void {
    const headers = [
        "First Name", "Last Name", "Email", "Phone Number",
        "Street Address", "Apt", "City", "State", "Zip Code",
    ];
    const rows = donors.map((d) =>
        [
            d.firstName, d.lastName, d.email, d.phoneNumber,
            d.address.streetAddress, d.address.apt,
            d.address.city, d.address.state, d.address.zipCode,
        ].map(escapeCSVField)
    );
    downloadCSV("donors.csv", headers, rows);
}

export function exportDonationRequests(requests: DonationRequest[], filename: string): void {
    const headers = [
        "First Name", "Last Name", "Email", "Phone Number",
        "Street Address", "Apt", "City", "State", "Zip Code",
        "First Time Donor", "Can Drop Off", "How Did You Hear", "Responded", "Notes",
        "Date Submitted", "Item Name", "Category", "Quantity", "Item Status",
        "Image 1", "Image 2", "Image 3", "Image 4",
    ];
    const rows = requests.flatMap((r) =>
        r.items.map((di) =>
            [
                r.donor.firstName, r.donor.lastName, r.donor.email, r.donor.phoneNumber,
                r.donor.address.streetAddress, r.donor.address.apt,
                r.donor.address.city, r.donor.address.state, r.donor.address.zipCode,
                r.firstTimeDonor ? "Yes" : "No",
                r.canDropOff ? "Yes" : "No",
                r.howDidYouHear,
                r.responded ? "Yes" : "No",
                r.notes,
                r.date.toDate().toLocaleDateString(),
                di.item.name, di.item.category, String(di.item.quantity), di.status,
                di.item.photos[0]?.url ?? "",
                di.item.photos[1]?.url ?? "",
                di.item.photos[2]?.url ?? "",
                di.item.photos[3]?.url ?? "",
            ].map(escapeCSVField)
        )
    );
    downloadCSV(filename, headers, rows);
}

function clientRequestBaseRow(r: ClientRequest): string[] {
    const q = r.client.questions;
    return [
        r.client.firstName, r.client.lastName, r.client.email ?? "", r.client.phoneNumber,
        r.client.address.streetAddress, r.client.address.apt,
        r.client.address.city, r.client.address.state, r.client.address.zipCode,
        r.client.hmis, r.client.programName,
        r.client.secondaryContact.name, r.client.secondaryContact.relationship, r.client.secondaryContact.phone,
        q.clientSpeaksEnglish != null ? (q.clientSpeaksEnglish ? "Yes" : "No") : "",
        q.preferredLanguage ?? "",
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
    "Speaks English", "Preferred Language", "Adults in Family", "Children in Family", "Is Veteran",
    "Can Pick Up", "Was Chronic", "Has Moved In", "Move In Date", "Has Elevator", "Client Notes",
] as const;

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
        "Case Manager", "Case Manager Email", "Admin Notes", "Items",
    ];
    const rows = requests.map((r) => {
        const cm = byId.get(r.caseManagerID);
        const items = r.items.map((i) => `${i.quantity} ${i.name}`).join("\n");
        return [
            ...clientRequestBaseRow(r),
            r.date.toDate().toLocaleDateString(),
            ...(includeStatus ? [r.status] : []),
            cm ? `${cm.firstName} ${cm.lastName}` : "",
            cm?.email ?? "",
            r.notes,
            items,
        ].map(escapeCSVField);
    });
    downloadCSV(filename, headers, rows);
}

