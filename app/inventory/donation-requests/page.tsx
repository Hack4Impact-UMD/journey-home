"use client";

import { DRContentsTable } from "@/components/donation-requests/DRContentsTable";
import { DRTable } from "@/components/donation-requests/DRTable";
import { DonationRequest } from "@/types/donations";
import { InventoryRecord } from "@/types/inventory";
import { Timestamp } from "firebase/firestore";
import { useState } from "react";

const sampleInventoryItems: InventoryRecord[] = [
    {
        id: "INV001",
        name: "Ergonomic Office Chair",
        photos: [
            {
                url: "https://picsum.photos/500/200",
                altText: "Black ergonomic office chair front view",
            },
            {
                url: "https://example.com/chair2.jpg",
                altText: "Black ergonomic office chair side view",
            },
        ],
        category: "Furniture",
        notes: "Mesh back, adjustable height, lumbar support. Some minor wear on armrests.",
        quantity: 1,
        size: "Large",
        dateAdded: Timestamp.fromDate(new Date("2024-10-15T10:00:00")),
        donorEmail: "previous.donor@email.com",
    },
    {
        id: "INV002",
        name: "Dell Latitude Laptop",
        photos: [
            {
                url: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/dell-plus/db14250/laptop-dell-db14250-copilot-pc-mg.png?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=589&qlt=100,1&resMode=sharp2&size=589,402&chrss=full",
                altText: "Dell laptop open on desk",
            },
        ],
        category: "Electronics",
        notes: "i5 processor, 8GB RAM, 256GB SSD. Windows 11. Minor scratches on case.",
        quantity: 1,
        size: "Small",
        dateAdded: Timestamp.fromDate(new Date("2024-10-20T14:30:00")),
        donorEmail: "tech.company@business.com",
    },
    {
        id: "INV003",
        name: "Standing Desk - Adjustable",
        photos: [
            {
                url: "https://fastly.picsum.photos/id/313/200/300.jpg?hmac=7_pHHv7TyDti50LaIVPvCPkdWDgM0tcX3ViCIWruEDQ",
                altText: "White standing desk at lowest height",
            },
            {
                url: "https://example.com/desk2.jpg",
                altText: "White standing desk at standing height",
            },
        ],
        category: "Furniture",
        notes: "Electric height adjustment, 48x30 inches. White surface with black frame. Excellent condition.",
        quantity: 1,
        size: "Large",
        dateAdded: Timestamp.fromDate(new Date("2024-09-28T09:15:00")),
        donorEmail: null,
    },
    {
        id: "INV004",
        name: "HP 24-inch Monitor",
        photos: [
            {
                url: "https://fastly.picsum.photos/id/865/400/400.jpg?hmac=QIN9FBOMjQhJWA3pfiF-b6yH9S9eK9qnaYGRROTicgk",
                altText: "HP monitor displaying desktop",
            },
        ],
        category: "Electronics",
        notes: "1080p resolution, HDMI and VGA ports. Includes stand and power cable.",
        quantity: 2,
        size: "Medium",
        dateAdded: Timestamp.fromDate(new Date("2024-10-18T11:20:00")),
        donorEmail: "office.upgrade@corp.com",
    },
    {
        id: "INV005",
        name: "5-Shelf Bookcase",
        photos: [
            {
                url: "https://picsum.photos/200/500",
                altText: "Wooden bookshelf against wall",
            },
        ],
        category: "Furniture",
        notes: "Solid wood construction, dark brown finish. 72 inches tall. Some minor scuffs.",
        quantity: 1,
        size: "Large",
        dateAdded: Timestamp.fromDate(new Date("2024-10-05T16:45:00")),
        donorEmail: "home.office@gmail.com",
    },
    {
        id: "INV006",
        name: "Office Supplies Bundle",
        photos: [
            {
                url: "https://example.com/supplies1.jpg",
                altText: "Box of various office supplies",
            },
        ],
        category: "Supplies",
        notes: "Pens, pencils, staplers, paper clips, sticky notes, folders. All new/unused.",
        quantity: 1,
        size: "Small",
        dateAdded: Timestamp.fromDate(new Date("2024-10-22T13:00:00")),
        donorEmail: "supply.closet@company.net",
    },
    {
        id: "INV007",
        name: "4-Drawer Filing Cabinet",
        photos: [
            {
                url: "https://example.com/filing1.jpg",
                altText: "Gray metal filing cabinet",
            },
        ],
        category: "Furniture",
        notes: "Metal construction, gray color. All drawers function smoothly. Includes lock and keys.",
        quantity: 1,
        size: "Large",
        dateAdded: Timestamp.fromDate(new Date("2024-09-30T08:30:00")),
        donorEmail: null,
    },
    {
        id: "INV008",
        name: "HP LaserJet Printer",
        photos: [
            {
                url: "https://picsum.photos/200/500",
                altText: "Black HP printer on desk",
            },
            {
                url: "https://picsum.photos/200/300",
                altText: "HP printer control panel closeup",
            },
        ],
        category: "Electronics",
        notes: "Black and white laser printer. Network capable. Includes power cable and USB cable.",
        quantity: 1,
        size: "Medium",
        dateAdded: Timestamp.fromDate(new Date("2024-10-12T10:15:00")),
        donorEmail: "it.dept@business.org",
    },
    {
        id: "INV009",
        name: "Conference Table - 8 Person",
        photos: [
            {
                url: "https://example.com/table1.jpg",
                altText: "Large conference table in meeting room",
            },
        ],
        category: "Furniture",
        notes: "96x42 inches, seats 8 people. Wood veneer surface. Some minor scratches from use.",
        quantity: 1,
        size: "Large",
        dateAdded: Timestamp.fromDate(new Date("2024-10-01T15:30:00")),
        donorEmail: "conference.room@startup.com",
    },
    {
        id: "INV010",
        name: "Magnetic Whiteboard",
        photos: [
            {
                url: "https://example.com/whiteboard1.jpg",
                altText: "White magnetic whiteboard with markers",
            },
        ],
        category: "Supplies",
        notes: "48x36 inches. Includes marker tray and mounting hardware. Good condition.",
        quantity: 1,
        size: "Large",
        dateAdded: Timestamp.fromDate(new Date("2024-10-08T12:00:00")),
        donorEmail: "classroom@school.edu",
    },
    {
        id: "INV011",
        name: "Wireless Keyboard & Mouse Set",
        photos: [
            {
                url: "https://example.com/keyboard1.jpg",
                altText: "Black wireless keyboard and mouse",
            },
        ],
        category: "Electronics",
        notes: "Logitech wireless combo. USB receiver included. Batteries not included.",
        quantity: 5,
        size: "Small",
        dateAdded: Timestamp.fromDate(new Date("2024-10-25T09:45:00")),
        donorEmail: "bulk.donation@tech.com",
    },
    {
        id: "INV012",
        name: "Cardboard Storage Boxes",
        photos: [
            {
                url: "https://example.com/boxes1.jpg",
                altText: "Stack of cardboard storage boxes",
            },
        ],
        category: "Supplies",
        notes: "Letter/legal size file boxes. Includes lids. Never used, still flat-packed.",
        quantity: 10,
        size: "Medium",
        dateAdded: Timestamp.fromDate(new Date("2024-10-19T14:20:00")),
        donorEmail: null,
    },
];

const mockDonationRequests: DonationRequest[] = [
    {
        id: "DR001",
        donor: {
            firstName: "Sarah",
            lastName: "Johnson",
            email: "sarah.johnson@email.com",
            phoneNumber: "(555) 123-4567",
            address: {
                streetAddress: "123 Main Street",
                city: "Springfield",
                state: "IL",
                zipCode: "62701",
            },
        },
        firstTimeDonor: true,
        howDidYouHear: "Google Search",
        canDropOff: true,
        notes: "Moving to a smaller office, have various furniture items in good condition.",
        date: Timestamp.fromDate(new Date("2024-11-01T10:30:00")),
        items: [
            { item: sampleInventoryItems[0], status: "Approved" },
            { item: sampleInventoryItems[1], status: "Denied" },
            { item: sampleInventoryItems[2], status: "Approved" },
            { item: sampleInventoryItems[3], status: "Not Reviewed" },
        ],
    },
    {
        id: "DR002",
        donor: {
            firstName: "Michael",
            lastName: "Chen",
            email: "m.chen@business.com",
            phoneNumber: "(555) 234-5678",
            address: {
                streetAddress: "456 Oak Avenue",
                city: "Portland",
                state: "OR",
                zipCode: "97201",
            },
        },
        firstTimeDonor: false,
        howDidYouHear: "Previous Donor",
        canDropOff: false,
        notes: "Company upgrade - electronics are 2-3 years old but fully functional. Need pickup.",
        date: Timestamp.fromDate(new Date("2024-10-28T14:15:00")),
        items: [
            { item: sampleInventoryItems[1], status: "Not Reviewed" },
            { item: sampleInventoryItems[3], status: "Not Reviewed" },
            { item: sampleInventoryItems[7], status: "Approved" },
        ],
    },
    {
        id: "DR003",
        donor: {
            firstName: "Emily",
            lastName: "Rodriguez",
            email: "emily.r@outlook.com",
            phoneNumber: "(555) 345-6789",
            address: {
                streetAddress: "789 Elm Street",
                city: "Austin",
                state: "TX",
                zipCode: "78701",
            },
        },
        firstTimeDonor: true,
        howDidYouHear: "Social Media",
        canDropOff: true,
        notes: "Downsizing home office. Everything is gently used.",
        date: Timestamp.fromDate(new Date("2024-10-25T09:00:00")),
        items: [
            { item: sampleInventoryItems[4], status: "Denied" },
            { item: sampleInventoryItems[5], status: "Approved" },
        ],
    },
    {
        id: "DR004",
        donor: {
            firstName: "David",
            lastName: "Williams",
            email: "d.williams@company.net",
            phoneNumber: "(555) 456-7890",
            address: {
                streetAddress: "321 Pine Road",
                city: "Seattle",
                state: "WA",
                zipCode: "98101",
            },
        },
        firstTimeDonor: false,
        howDidYouHear: "Word of Mouth",
        canDropOff: false,
        notes: "Office closure - need to donate everything by end of month. Large quantity available.",
        date: Timestamp.fromDate(new Date("2024-11-03T11:45:00")),
        items: [
            { item: sampleInventoryItems[0], status: "Not Reviewed" },
            { item: sampleInventoryItems[6], status: "Not Reviewed" },
            { item: sampleInventoryItems[8], status: "Not Reviewed" },
            { item: sampleInventoryItems[11], status: "Not Reviewed" },
        ],
    },
    {
        id: "DR005",
        donor: {
            firstName: "Jessica",
            lastName: "Martinez",
            email: "jess.martinez@gmail.com",
            phoneNumber: "(555) 567-8901",
            address: {
                streetAddress: "654 Maple Drive",
                city: "Denver",
                state: "CO",
                zipCode: "80201",
            },
        },
        firstTimeDonor: true,
        howDidYouHear: "Community Event",
        canDropOff: true,
        notes: "Small donation - upgrading home office setup.",
        date: Timestamp.fromDate(new Date("2024-10-30T16:20:00")),
        items: [{ item: sampleInventoryItems[1], status: "Approved" }],
    },
    {
        id: "DR006",
        donor: {
            firstName: "Robert",
            lastName: "Taylor",
            email: "rob.taylor@corporation.com",
            phoneNumber: "(555) 678-9012",
            address: {
                streetAddress: "987 Cedar Lane",
                city: "Boston",
                state: "MA",
                zipCode: "02101",
            },
        },
        firstTimeDonor: false,
        howDidYouHear: "Previous Donor",
        canDropOff: false,
        notes: "Renovation project - multiple items available. Pickup preferred on weekdays.",
        date: Timestamp.fromDate(new Date("2024-11-05T13:30:00")),
        items: [
            { item: sampleInventoryItems[2], status: "Not Reviewed" },
            { item: sampleInventoryItems[8], status: "Not Reviewed" },
            { item: sampleInventoryItems[9], status: "Not Reviewed" },
        ],
    },
    {
        id: "DR007",
        donor: {
            firstName: "Amanda",
            lastName: "Lee",
            email: "amanda.lee@email.com",
            phoneNumber: "(555) 789-0123",
            address: {
                streetAddress: "147 Birch Street",
                city: "Phoenix",
                state: "AZ",
                zipCode: "85001",
            },
        },
        firstTimeDonor: true,
        howDidYouHear: "Facebook",
        canDropOff: true,
        notes: "Cleaning out storage unit. Items have been in climate-controlled storage.",
        date: Timestamp.fromDate(new Date("2024-10-22T08:45:00")),
        items: [
            { item: sampleInventoryItems[5], status: "Not Reviewed" },
            { item: sampleInventoryItems[11], status: "Not Reviewed" },
        ],
    },
    {
        id: "DR008",
        donor: {
            firstName: "Christopher",
            lastName: "Anderson",
            email: "c.anderson@business.org",
            phoneNumber: "(555) 890-1234",
            address: {
                streetAddress: "258 Willow Court",
                city: "Miami",
                state: "FL",
                zipCode: "33101",
            },
        },
        firstTimeDonor: false,
        howDidYouHear: "Email Newsletter",
        canDropOff: false,
        notes: "Tech upgrade cycle - all equipment tested and working. Need pickup ASAP.",
        date: Timestamp.fromDate(new Date("2024-11-02T15:00:00")),
        items: [
            { item: sampleInventoryItems[1], status: "Approved" },
            { item: sampleInventoryItems[3], status: "Approved" },
            { item: sampleInventoryItems[10], status: "Not Reviewed" },
        ],
    },
    {
        id: "DR009",
        donor: {
            firstName: "Nicole",
            lastName: "Thomas",
            email: "nicole.thomas@mail.com",
            phoneNumber: "(555) 901-2345",
            address: {
                streetAddress: "369 Spruce Avenue",
                city: "Nashville",
                state: "TN",
                zipCode: "37201",
            },
        },
        firstTimeDonor: true,
        howDidYouHear: "LinkedIn",
        canDropOff: true,
        notes: "Estate donation - items belonged to family member. High quality furniture.",
        date: Timestamp.fromDate(new Date("2024-10-27T12:00:00")),
        items: [
            { item: sampleInventoryItems[0], status: "Denied" },
            { item: sampleInventoryItems[4], status: "Approved" },
            { item: sampleInventoryItems[6], status: "Approved" },
        ],
    },
    {
        id: "DR010",
        donor: {
            firstName: "James",
            lastName: "Jackson",
            email: "james.jackson@tech.com",
            phoneNumber: "(555) 012-3456",
            address: {
                streetAddress: "741 Aspen Boulevard",
                city: "San Francisco",
                state: "CA",
                zipCode: "94101",
            },
        },
        firstTimeDonor: false,
        howDidYouHear: "Company Partnership",
        canDropOff: true,
        notes: "Annual donation from company surplus. Multiple items available in excellent condition.",
        date: Timestamp.fromDate(new Date("2024-11-06T10:00:00")),
        items: [
            { item: sampleInventoryItems[7], status: "Not Reviewed" },
            { item: sampleInventoryItems[9], status: "Not Reviewed" },
            { item: sampleInventoryItems[10], status: "Not Reviewed" },
            { item: sampleInventoryItems[11], status: "Not Reviewed" },
            { item: sampleInventoryItems[11], status: "Not Reviewed" },
        ],
    },
];

export default function DonationRequestsPage() {
    const [selectedDR, setSelectedDR] = useState<DonationRequest | null>(
        mockDonationRequests[0]
    );

    return selectedDR ? (
        <>
            <div className="flex flex-col">
                <div className="flex gap-3">
                    <button 
                        className="w-16 h-8 text-white bg-primary rounded-xs text-sm"
                        onClick={() => setSelectedDR(null)}
                    >
                        Back
                    </button>
                    <input type="text" className="w-64 h-8 border border-light-border rounded-xs"></input>
                </div>

                <span className="font-bold py-4.5">
                    {selectedDR.donor.firstName} {selectedDR.donor.lastName}
                </span>
            </div>
            <DRContentsTable request={selectedDR} />
        </>
    ) : (
        <>
            <DRTable donationRequests={mockDonationRequests} openDR={setSelectedDR} />
        </>
    );
}
