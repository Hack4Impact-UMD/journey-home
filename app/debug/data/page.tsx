"use client";

import { createDonationRequest } from "@/lib/services/donations";
import { setInventoryCategory, uploadImage } from "@/lib/services/inventory";
import { DonationItem, DonationRequest } from "@/types/donations";
import { InventoryCategory, InventoryChange, InventoryPhoto } from "@/types/inventory";
import { query, Timestamp, where } from "@firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { LocationContact } from "@/types/general";
import { ClientRequest } from "@/types/client-requests";
import { UserData } from "@/types/user";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { TimeBlock } from "@/types/schedule";
import { collection, getDocs } from "firebase/firestore";
import { toast, Toaster } from "sonner";


const CASEREQUEST = "client-requests";
const TIMEBLOCK = "timeblocks";

const SEED_DONORS: LocationContact[] = [
    {
        firstName: "Michael",
        lastName: "Donovan",
        email: "michaeldonovan@gmail.com",
        phoneNumber: "860-555-1423",
        address: {
            streetAddress: "112 Park Terrace",
            city: "Hartford",
            state: "CT",
            zipCode: "06106",
        },
    },
    {
        firstName: "Sarah",
        lastName: "Whitman",
        email: "sarahwhitman@gmail.com",
        phoneNumber: "860-555-3841",
        address: {
            streetAddress: "47 Oxford Street",
            city: "Hartford",
            state: "CT",
            zipCode: "06105",
        },
    },
    {
        firstName: "Daniel",
        lastName: "Reynolds",
        email: "danielreynolds@gmail.com",
        phoneNumber: "860-555-9012",
        address: {
            streetAddress: "389 Zion Street",
            city: "Hartford",
            state: "CT",
            zipCode: "06106",
        },
    },
    {
        firstName: "Emily",
        lastName: "Carter",
        email: "emilycarter@gmail.com",
        phoneNumber: "860-555-2765",
        address: {
            streetAddress: "18 Prospect Avenue",
            city: "Hartford",
            state: "CT",
            zipCode: "06105",
        },
    },
    {
        firstName: "James",
        lastName: "Holloway",
        email: "jamesholloway@gmail.com",
        phoneNumber: "860-555-6634",
        address: {
            streetAddress: "241 Farmington Avenue",
            city: "Hartford",
            state: "CT",
            zipCode: "06105",
        },
    },
    {
        firstName: "Olivia",
        lastName: "Bennett",
        email: "oliviabennett@gmail.com",
        phoneNumber: "860-555-4921",
        address: {
            streetAddress: "76 Sargeant Street",
            city: "Hartford",
            state: "CT",
            zipCode: "06105",
        },
    },
    {
        firstName: "Anthony",
        lastName: "Marino",
        email: "anthonymarino@gmail.com",
        phoneNumber: "860-555-7304",
        address: {
            streetAddress: "505 Franklin Avenue",
            city: "Hartford",
            state: "CT",
            zipCode: "06114",
        },
    },
    {
        firstName: "Rachel",
        lastName: "Sullivan",
        email: "rachelsullivan@gmail.com",
        phoneNumber: "860-555-1189",
        address: {
            streetAddress: "29 Laurel Street",
            city: "Hartford",
            state: "CT",
            zipCode: "06106",
        },
    },
    {
        firstName: "Christopher",
        lastName: "Nguyen",
        email: "christophernguyen@gmail.com",
        phoneNumber: "860-555-8472",
        address: {
            streetAddress: "134 New Britain Avenue",
            city: "Hartford",
            state: "CT",
            zipCode: "06106",
        },
    },
    {
        firstName: "Hannah",
        lastName: "Morales",
        email: "hannahmorales@gmail.com",
        phoneNumber: "860-555-2550",
        address: {
            streetAddress: "63 Sherman Street",
            city: "Hartford",
            state: "CT",
            zipCode: "06105",
        },
    },
    {
        firstName: "David",
        lastName: "Klein",
        email: "davidklein@gmail.com",
        phoneNumber: "860-555-6991",
        address: {
            streetAddress: "91 Scarborough Street",
            city: "Hartford",
            state: "CT",
            zipCode: "06105",
        },
    },
    {
        firstName: "Lauren",
        lastName: "O'Connor",
        email: "laurenoconnor@gmail.com",
        phoneNumber: "860-555-3408",
        address: {
            streetAddress: "58 Buckingham Street",
            city: "Hartford",
            state: "CT",
            zipCode: "06106",
        },
    },
    {
        firstName: "Matthew",
        lastName: "Foster",
        email: "matthewfoster@gmail.com",
        phoneNumber: "860-555-5816",
        address: {
            streetAddress: "212 Gifford Street",
            city: "Hartford",
            state: "CT",
            zipCode: "06106",
        },
    },
    {
        firstName: "Sophia",
        lastName: "Ramirez",
        email: "sophiaramirez@gmail.com",
        phoneNumber: "860-555-7749",
        address: {
            streetAddress: "401 Broad Street",
            city: "Hartford",
            state: "CT",
            zipCode: "06114",
        },
    },
    {
        firstName: "Brian",
        lastName: "Thompson",
        email: "brianthompson@gmail.com",
        phoneNumber: "860-555-9273",
        address: {
            streetAddress: "19 Wethersfield Avenue",
            city: "Hartford",
            state: "CT",
            zipCode: "06114",
        },
    },
    {
        firstName: "Natalie",
        lastName: "Pierce",
        email: "nataliepierce@gmail.com",
        phoneNumber: "860-555-6128",
        address: {
            streetAddress: "87 Capitol Avenue",
            city: "Hartford",
            state: "CT",
            zipCode: "06106",
        },
    },
    {
        firstName: "Kevin",
        lastName: "Brooks",
        email: "kevinbrooks@gmail.com",
        phoneNumber: "860-555-4039",
        address: {
            streetAddress: "145 Barbour Street",
            city: "Hartford",
            state: "CT",
            zipCode: "06120",
        },
    },
    {
        firstName: "Isabella",
        lastName: "Lopez",
        email: "isabellalopez@gmail.com",
        phoneNumber: "860-555-2194",
        address: {
            streetAddress: "34 Garden Street",
            city: "Hartford",
            state: "CT",
            zipCode: "06112",
        },
    },
    {
        firstName: "Andrew",
        lastName: "Walsh",
        email: "andrewwalsh@gmail.com",
        phoneNumber: "860-555-8642",
        address: {
            streetAddress: "260 Albany Avenue",
            city: "Hartford",
            state: "CT",
            zipCode: "06112",
        },
    },
    {
        firstName: "Megan",
        lastName: "Fitzgerald",
        email: "meganfitzgerald@gmail.com",
        phoneNumber: "860-555-7381",
        address: {
            streetAddress: "71 Woodland Street",
            city: "Hartford",
            state: "CT",
            zipCode: "06105",
        },
    },
    {
        firstName: "Joshua",
        lastName: "Patel",
        email: "joshuapatel@gmail.com",
        phoneNumber: "860-555-4507",
        address: {
            streetAddress: "98 Brook Street",
            city: "Hartford",
            state: "CT",
            zipCode: "06120",
        },
    },
    {
        firstName: "Amanda",
        lastName: "Greene",
        email: "amandagreen@gmail.com",
        phoneNumber: "860-555-3926",
        address: {
            streetAddress: "156 Vine Street",
            city: "Hartford",
            state: "CT",
            zipCode: "06112",
        },
    },
    {
        firstName: "Ryan",
        lastName: "Collins",
        email: "ryancollins@gmail.com",
        phoneNumber: "860-555-5880",
        address: {
            streetAddress: "44 Maple Avenue",
            city: "Hartford",
            state: "CT",
            zipCode: "06114",
        },
    },
    {
        firstName: "Victoria",
        lastName: "Shaw",
        email: "victoriashaw@gmail.com",
        phoneNumber: "860-555-6712",
        address: {
            streetAddress: "203 Jefferson Street",
            city: "Hartford",
            state: "CT",
            zipCode: "06106",
        },
    },
    {
        firstName: "Eric",
        lastName: "Montgomery",
        email: "ericmontgomery@gmail.com",
        phoneNumber: "860-555-8294",
        address: {
            streetAddress: "59 Newfield Avenue",
            city: "Hartford",
            state: "CT",
            zipCode: "06106",
        },
    },
];
const ITEM_DESCRIPTIONS: Record<string, ItemDetail[]> = {
    Sofas: [
        { title: "Gray L-shaped Sofa", size: "Large" },
        { title: "Brown L-shaped Sofa", size: "Large" },
        { title: "Green Sofa", size: "Large" },
        { title: "Massive Gray Sofa", size: "Large" },
    ],
    Dressers: [
        { title: "Orange ish colored dresser thing", size: "Large" },
        { title: "Sleek black dresser", size: "Large" },
        { title: "White dresser", size: "Large" },
        { title: "dark brown dresser", size: "Large" },
    ],
    "Kitchen Tables": [
        { title: "White Modern Kitchen Table", size: "Large" },
        { title: "Brown and Green Kitchen Table", size: "Large" },
        { title: "Red-Brown Kitchen Table", size: "Large" },
        { title: "Light Brown Kitchen Table", size: "Large" },
    ],
    "Area Rugs": [
        { title: "Persian Area Rug", size: "Large" },
        { title: "Black and White Area Rug", size: "Large" },
        { title: "Character Area Rug", size: "Medium" },
        { title: "Thick Area Rug(Cat not included)", size: "Large" },
    ],
    Armchairs: [
        { title: "Beige Armchair", size: "Medium" },
        { title: "Fancy Old Armchair", size: "Medium" },
        { title: "Jaymar Post Modern Sculptural Tongue Armchair", size: "Medium" },
        { title: "Throne Armchair", size: "Large" },
    ],
    "Box Springs": [
        { title: "Box Spring Queen", size: "Large" },
        { title: "Queen Sized Box Spring", size: "Large" },
        { title: "Tempur-pedic King Sized Box Spring", size: "Large" },
        { title: "Twin Box Spring", size: "Large" },
    ],
    "Coffee Tables": [
        { title: "Circular Gear Coffee Table", size: "Medium" },
        { title: "Pear-Shaped Coffee Table", size: "Medium" },
        { title: "White Modern Coffee Table", size: "Medium" },
        { title: "Glass Coffee Table", size: "Medium" },
    ],
    "End Tables": [
        { title: "Brown End Table", size: "Small" },
        { title: "Skinny Brown End Table", size: "Small" },
        { title: "Unique Mosaic End Table", size: "Small" },
        { title: "Circular Solid Wood End Table", size: "Small" },
    ],
    "Kitchen Chairs": [
        { title: "Modern Black Dining Table Chairs", size: "Medium" },
        { title: "Camel Leather Dining Chairs", size: "Medium" },
        { title: "Set of 5 Gray Dining Chairs", size: "Medium" },
        { title: "Uncomfortable Kitchen Chairs", size: "Medium" },
    ],
    Loveseats: [
        { title: "Gray Loveseat", size: "Large" },
        { title: "Brown Microfiber Suede Loveseat", size: "Large" },
        { title: "Gray rectangular loveseat", size: "Large" },
        { title: "Confusing Loveseat", size: "Large" },
    ],
    Mattresses: [
        { title: "Queen Sized 10 Inch Mattress", size: "Large" },
        { title: "Twin Sized Mattress", size: "Large" },
        { title: "Queen Sized Mattress", size: "Large" },
        { title: "Full Sized Mattress", size: "Large" },
    ],
    "Microwave Stands": [
        { title: "Dark Brown Microwave Stand", size: "Medium" },
        { title: "Dual Shade Microwave Stand", size: "Medium" },
        { title: "Kitchen and Microwave Stand", size: "Large" },
        { title: "Ikea Microwave Stand", size: "Medium" },
    ],
    Nightstands: [
        { title: "Dark green nightstand", size: "Small" },
        { title: "Wood Nightstand with metal legs", size: "Small" },
        { title: "Maple Nightstand", size: "Small" },
        { title: "Dark Brown nightstand", size: "Small" },
    ],
    "Small Bookshelves": [
        { title: "Little Blue Bookshelf", size: "Small" },
        { title: "Ladder Bookshelf", size: "Medium" },
        { title: "Small Dark Brown Bookshelf", size: "Small" },
        { title: "Skinny Bookshelf", size: "Small" },
    ],
    "TV Stands": [
        { title: "Rusted brown tv stand", size: "Medium" },
        { title: "Deep brown TV stand", size: "Medium" },
        { title: "Low Brown IKEA TV stand", size: "Medium" },
        { title: "Shiny Brown TV Stand", size: "Medium" },
    ],
    TVs: [
        { title: "75 inch ROKU TV", size: "Large" },
        { title: "Vizio 40in 1080p Smart TV", size: "Medium" },
        { title: "45in Samsung TV", size: "Medium" },
        { title: "9in CRT TV w/ VCR", size: "Small" },
    ],
};

const SEED_REQS = [
    // ===== ADMINS (5) =====
    {
        email: "marcus.johnson@journeyhome.org",
        password: "password",
        first: "Marcus",
        last: "Johnson",
        dob: Timestamp.fromDate(new Date("1983-05-12T08:30:00")),
        role: "Admin",
    },
    {
        email: "elena.rodriguez@journeyhome.org",
        password: "password",
        first: "Elena",
        last: "Rodriguez",
        dob: Timestamp.fromDate(new Date("1988-11-20T14:15:00")),
        role: "Admin",
    },
    {
        email: "william.chen@journeyhome.org",
        password: "password",
        first: "William",
        last: "Chen",
        dob: Timestamp.fromDate(new Date("1985-02-14T09:45:00")),
        role: "Admin",
    },
    {
        email: "samantha.wright@journeyhome.org",
        password: "password",
        first: "Samantha",
        last: "Wright",
        dob: Timestamp.fromDate(new Date("1991-08-05T11:20:00")),
        role: "Admin",
    },
    {
        email: "jonathan.davis@journeyhome.org",
        password: "password",
        first: "Jonathan",
        last: "Davis",
        dob: Timestamp.fromDate(new Date("1980-12-01T16:00:00")),
        role: "Admin",
    },

    // ===== CASE MANAGERS (10) =====
    {
        email: "jessica.taylor@journeyhome.org",
        password: "password",
        first: "Jessica",
        last: "Taylor",
        dob: Timestamp.fromDate(new Date("1994-03-22T10:00:00")),
        role: "Case Manager",
    },
    {
        email: "anthony.moore@journeyhome.org",
        password: "password",
        first: "Anthony",
        last: "Moore",
        dob: Timestamp.fromDate(new Date("1995-07-11T13:30:00")),
        role: "Case Manager",
    },
    {
        email: "ashley.jackson@journeyhome.org",
        password: "password",
        first: "Ashley",
        last: "Jackson",
        dob: Timestamp.fromDate(new Date("1992-09-28T09:10:00")),
        role: "Case Manager",
    },
    {
        email: "brian.white@journeyhome.org",
        password: "password",
        first: "Brian",
        last: "White",
        dob: Timestamp.fromDate(new Date("1990-04-16T15:20:00")),
        role: "Case Manager",
    },
    {
        email: "melissa.harris@journeyhome.org",
        password: "password",
        first: "Melissa",
        last: "Harris",
        dob: Timestamp.fromDate(new Date("1996-10-04T11:05:00")),
        role: "Case Manager",
    },
    {
        email: "christopher.martin@journeyhome.org",
        password: "password",
        first: "Christopher",
        last: "Martin",
        dob: Timestamp.fromDate(new Date("1993-01-09T14:40:00")),
        role: "Case Manager",
    },
    {
        email: "stephanie.clark@journeyhome.org",
        password: "password",
        first: "Stephanie",
        last: "Clark",
        dob: Timestamp.fromDate(new Date("1997-06-18T08:55:00")),
        role: "Case Manager",
    },
    {
        email: "matthew.lewis@journeyhome.org",
        password: "password",
        first: "Matthew",
        last: "Lewis",
        dob: Timestamp.fromDate(new Date("1991-11-25T12:15:00")),
        role: "Case Manager",
    },
    {
        email: "rachel.martinez@journeyhome.org",
        password: "password",
        first: "Rachel",
        last: "Martinez",
        dob: Timestamp.fromDate(new Date("1998-02-03T09:50:00")),
        role: "Case Manager",
    },
    {
        email: "justin.walker@journeyhome.org",
        password: "password",
        first: "Justin",
        last: "Walker",
        dob: Timestamp.fromDate(new Date("1995-12-14T16:25:00")),
        role: "Case Manager",
    },
];


type SeedImage = {
    file: File;
    title: string;
    size: "Small"|"Medium"|"Large";
};
type ItemDetail = {
    title: string;
    size: "Small"|"Medium"|"Large";
};
function randomTimestamp(days: number = 90): Timestamp {
    const now = Date.now(); // current time in ms
    const past = now - days * 24 * 60 * 60 * 1000; // ms timestamp X days ago
    const randomTime = past + Math.random() * (now - past); // random ms between past and now
    return Timestamp.fromDate(new Date(randomTime));
}

const seedImageCache: Record<string, SeedImage[]> = {};
function getPublicUrl(path: string) {
    if (typeof window !== "undefined") return path;
    return `http://localhost:3000${path}`;
}
async function getSeedImagePool(category: string): Promise<SeedImage[]> {
    if (!seedImageCache[category]) {
        seedImageCache[category] = await loadSeedImages(category);
    }
    return seedImageCache[category];
}
async function seedImageToPhotos(seed: SeedImage): Promise<InventoryPhoto[]> {
    return [
        {
            url: await uploadImage(seed.file),
            altText: seed.title,
        },
    ];
}


async function addDonationRequests(completed = false) {
    const time = randomTimestamp();
    const donor: LocationContact = randomFrom(SEED_DONORS);

    const items: DonationItem[] = [];

    const shuffledCategories = [...DEFAULT_CATEGORIES].sort(() => Math.random() - 0.5);
    const numCategories = Math.floor(Math.random() * DEFAULT_CATEGORIES.length) + 1;
    const selectedCategories = shuffledCategories.slice(0, numCategories);

const MAX_ITEMS = 15;
    const numItems = Math.floor(Math.random() * MAX_ITEMS) + 1;
    const itemsPerCategory: Record<string, number> = {};

    // 1. Distribute items freely (no caps, no infinite loops!)
    for (let i = 0; i < numItems; i++) {
        const category = randomFrom(selectedCategories);
        itemsPerCategory[category] = (itemsPerCategory[category] ?? 0) + 1;
    }
    for (const category of selectedCategories) {
        const quota = itemsPerCategory[category];
        if (!quota) continue;

        const imagePool = await getSeedImagePool(category);
        const shuffledImages = [...imagePool].sort(() => Math.random() - 0.5);
        const selectedImages = shuffledImages.slice(0, quota);

        for (const seedImage of selectedImages) {
            items.push({
                item: {
                    id: crypto.randomUUID(),
                    name: seedImage.title,
                    category,
                    size: seedImage.size,
                    quantity: 1,
                    notes: randomFrom(desc),
                    dateAdded: time,
                    donorEmail: donor.email,
                    photos: await seedImageToPhotos(seedImage),
                },
                status: completed
                    ? (Math.random() < 0.5 ? "Approved" : "Denied")
                    : (Math.random() < 0.9 ? "Not Reviewed" : (Math.random() < 0.5 ? "Approved" : "Denied")),
            });
        }
    }

    const request: DonationRequest = {
        id: crypto.randomUUID(),
        donor,
        firstTimeDonor: Math.random() > 0.5,
        howDidYouHear: randomFrom(["Instagram", "Friend", "Flyer", "Website"]),
        canDropOff: Math.random() > 0.5,
        notes: randomFrom([
            "Located on the 3rd floor, elevator available",
            "Please call before pickup",
            "Corner house with driveway access",
            "Apartment complex, bring ID for security",
            "Backyard pickup, parking available nearby",
            "Available after 5 PM weekdays",
            "Accessible via main street only",
            "Near public transportation",
            "Side entrance preferred",
            "Will need help carrying heavy items",
            "Front porch pickup possible",
            "Gate code required for entry",
            "Please bring your own dolly",
            "Close to community center",
            "Pickup on weekends only",
            "Front desk at building reception",
            "Ring the bell and wait for assistance",
            "Large items in garage, easy access",
            "Items already boxed for transport",
            "Contactless pickup preferred",
        ]),
        date: time,
        responded: completed ? Math.random() > 0.5 : false,
        items,
        associatedTimeBlockID: null, // no time block
    };

    console.log("creating donation request: " + request.id);
    await createDonationRequest(request);
}


async function loadSeedImages(category: string): Promise<SeedImage[]> {
    const imageNames = [
        `${category}0.jpg`,
        `${category}1.jpg`,
        `${category}2.jpg`,
        `${category}3.jpg`,
    ];

    const filesWithDescriptions: SeedImage[] = [];

    for (let i = 0; i < imageNames.length; i++) {
        // Grab the item object instead of just the string
        const itemData = ITEM_DESCRIPTIONS[category]?.[i];

        // Extract title and size with safe fallbacks
        const title = itemData?.title || "Other";
        const size = itemData?.size || "Medium";

        const url = getPublicUrl(`/seed-images/${category}/${imageNames[i]}`);
        const res = await fetch(url);
        const blob = await res.blob();

        const file = new File([blob], title, { type: blob.type });

        // Push the title, file, AND size to satisfy the SeedImage type
        filesWithDescriptions.push({ file, title, size });
    }

    return filesWithDescriptions;
}

async function setCaseRequest(record: ClientRequest): Promise<boolean> {
    try {
        const docRef = doc(db, CASEREQUEST, record.id);
        await setDoc(docRef, record);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

const DEFAULT_CATEGORIES: string[] = [
    "Mattresses",
    "Box Springs",
    "Sofas",
    "Loveseats",
    "Kitchen Tables",
    "Kitchen Chairs",
    "Armchairs",
    "Coffee Tables",
    "Dressers",
    "Nightstands",
    "TVs",
    "TV Stands",
    "Microwave Stands",
    "Small Bookshelves",
    "Area Rugs",
    "End Tables",
];

const DEFAULT_INVENTORY_CATEGORIES: Omit<InventoryCategory, "quantity">[] = [
    { id: crypto.randomUUID(), name: "Mattresses",        icon: "box", lowThreshold: 5,  highThreshold: 10 },
    { id: crypto.randomUUID(), name: "Box Springs",       icon: "box", lowThreshold: 5,  highThreshold: 10 },
    { id: crypto.randomUUID(), name: "Sofas",             icon: "box", lowThreshold: 3,  highThreshold: 7  },
    { id: crypto.randomUUID(), name: "Loveseats",         icon: "box", lowThreshold: 3,  highThreshold: 6  },
    { id: crypto.randomUUID(), name: "Kitchen Tables",    icon: "box", lowThreshold: 4,  highThreshold: 8  },
    { id: crypto.randomUUID(), name: "Kitchen Chairs",    icon: "box", lowThreshold: 8,  highThreshold: 15 },
    { id: crypto.randomUUID(), name: "Armchairs",         icon: "box", lowThreshold: 4,  highThreshold: 8  },
    { id: crypto.randomUUID(), name: "Coffee Tables",     icon: "box", lowThreshold: 4,  highThreshold: 8  },
    { id: crypto.randomUUID(), name: "Dressers",          icon: "box", lowThreshold: 5,  highThreshold: 10 },
    { id: crypto.randomUUID(), name: "Nightstands",       icon: "box", lowThreshold: 6,  highThreshold: 12 },
    { id: crypto.randomUUID(), name: "TVs",               icon: "box", lowThreshold: 3,  highThreshold: 6  },
    { id: crypto.randomUUID(), name: "TV Stands",         icon: "box", lowThreshold: 3,  highThreshold: 6  },
    { id: crypto.randomUUID(), name: "Microwave Stands",  icon: "box", lowThreshold: 4,  highThreshold: 8  },
    { id: crypto.randomUUID(), name: "Small Bookshelves", icon: "box", lowThreshold: 4,  highThreshold: 8  },
    { id: crypto.randomUUID(), name: "Area Rugs",         icon: "box", lowThreshold: 5,  highThreshold: 10 },
    { id: crypto.randomUUID(), name: "End Tables",        icon: "box", lowThreshold: 5,  highThreshold: 10 },
];

async function generateInventoryChanges(count: number): Promise<InventoryChange[]> {
  const users = await getDocs(
    query(collection(db, "users"), where("role", "in", ["Volunteer", "Admin"]))
  );
  const userIds = users.docs.map((doc) => doc.id);

  if (userIds.length === 0) throw new Error("no volunteers");

  const runningQty = Object.fromEntries(
    DEFAULT_INVENTORY_CATEGORIES.map((cat) => [
      cat.id,
      Math.floor(Math.random() * (cat.highThreshold - cat.lowThreshold + 1)) + cat.lowThreshold,
    ])
  );

  const now = Date.now();
  const twoMonthsMs = 60 * 86_400_000;

  // Generate and sort timestamps first
  const timestamps = Array.from({ length: count }, () =>
    now - Math.floor(Math.random() * twoMonthsMs)
  ).sort((a, b) => a - b); // oldest first

  return timestamps.map((ts): InventoryChange => {
    const cat = DEFAULT_INVENTORY_CATEGORIES[Math.floor(Math.random() * DEFAULT_INVENTORY_CATEGORIES.length)];

    const oldQuantity = runningQty[cat.id];
    const delta = Math.floor(Math.random() * 9) - 3;
    const newQuantity = Math.max(0, oldQuantity + delta);
    const reverted = Math.random() < 0.2;
    runningQty[cat.id] = reverted ? oldQuantity : newQuantity;

    return {
      id: crypto.randomUUID(),
      userId: userIds[Math.floor(Math.random() * userIds.length)],
      timestamp: Timestamp.fromMillis(ts),
      change: { category: cat.name, oldQuantity, newQuantity },
      reverted,
    };
  });
}

async function seedInventoryChanges(count: number) {
  const changes = await generateInventoryChanges(count);

  const writes = changes.map((change) =>
    setDoc(doc(db, "warehouseHistory", change.id), change)
  );

  await Promise.all(writes);
  console.log(`Seeded ${count} inventory changes`);
}

const desc = [
    "New: This item is brand new and has never been used. It comes in its original packaging and is ready for immediate use.",
    "Like New: The item is in excellent condition, almost indistinguishable from new. Only minor handling marks may be present.",
    "Good Condition: Fully functional with minor cosmetic wear. Suitable for everyday use without any major issues.",
    "Fair Condition: The item shows noticeable signs of use, such as small scratches or dents. Still fully usable.",
    "Used: This household item has been regularly used and may show visible signs of previous ownership. All essential parts are intact.",
    "Scratched: The surface has some scratches or marks. These are mainly cosmetic and do not affect functionality.",
    "Has Stains: There may be minor stains or discoloration on the item. Cleaning might improve appearance, but the item is still usable.",
    "Needs Repair: Some parts may be loose, damaged, or not fully functional. Repairs may be required before optimal use.",
    "Minor Chips: Small chips or nicks are present, usually on edges or corners. Structurally, the item is still sound.",
    "Faded: Colors may have dulled or faded due to sunlight or age. Functionality is not affected.",
    "Broken Leg: One or more legs may be damaged or unstable. The item may need support or repair for safe use.",
    "Loose Joints: Joints or connections may be wobbly. The item can be used with care or reinforced if needed.",
    "Recently Reupholstered: This furniture piece has fresh upholstery, improving both comfort and appearance. Some wear may still exist on other parts.",
    "Refinished: Surface or finish has been restored recently. Minor signs of previous use may remain.",
    "Rusty: Some metal parts show rust or corrosion. Cleaning or sanding may be needed to restore appearance.",
    "Cracked Surface: There are cracks in the surface or material, but the item remains functional for most purposes.",
    "Missing Parts: Certain small parts or accessories may be missing. The main item is still usable.",
    "Functional but Aesthetic Damage: The item works as intended, but cosmetic flaws such as scratches, dents, or discoloration are present.",
    "Vintage Wear: Shows normal wear consistent with age. Adds character to the piece but still functional.",
    "Hand-Crafted Details: Item has handmade or delicate elements that require gentle handling. Overall condition is good.",
];
export async function ensureCategoriesConfig() {
    await Promise.all(
        DEFAULT_INVENTORY_CATEGORIES.map((cat) =>
            setInventoryCategory({
                ...cat,
                quantity: Math.floor(Math.random() * (2 * cat.highThreshold + 1)),
            })
        )
    );
}

const SEED_USERS = [
    // ===== ADMINS (5) =====
    {
        email: "sarah.thompson@journeyhome.org",
        password: "password",
        first: "Sarah",
        last: "Thompson",
        dob: Timestamp.fromDate(new Date("1987-03-14T09:15:00")),
        role: "Admin",
    },
    {
        email: "david.lee@journeyhome.org",
        password: "password",
        first: "David",
        last: "Lee",
        dob: Timestamp.fromDate(new Date("1985-11-02T14:20:00")),
        role: "Admin",
    },
    {
        email: "amanda.brooks@journeyhome.org",
        password: "password",
        first: "Amanda",
        last: "Brooks",
        dob: Timestamp.fromDate(new Date("1990-01-25T08:40:00")),
        role: "Admin",
    },
    {
        email: "kevin.mitchell@journeyhome.org",
        password: "password",
        first: "Kevin",
        last: "Mitchell",
        dob: Timestamp.fromDate(new Date("1982-07-18T11:05:00")),
        role: "Admin",
    },
    {
        email: "lisa.reynolds@journeyhome.org",
        password: "password",
        first: "Lisa",
        last: "Reynolds",
        dob: Timestamp.fromDate(new Date("1989-09-09T16:30:00")),
        role: "Admin",
    },
    {
        email: "admin@test.com",
        password: "password",
        first: "Admin",
        last: "John",
        dob: Timestamp.fromDate(new Date("1989-09-09T16:30:00")),
        role: "Admin",
    },

    // ===== CASE MANAGERS (10) =====
    {
        email: "maria.garcia@journeyhome.org",
        password: "password",
        first: "Maria",
        last: "Garcia",
        dob: Timestamp.fromDate(new Date("1993-07-21T10:10:00")),
        role: "Case Manager",
    },
    {
        email: "jordan.patel@journeyhome.org",
        password: "password",
        first: "Jordan",
        last: "Patel",
        dob: Timestamp.fromDate(new Date("1991-05-30T13:50:00")),
        role: "Case Manager",
    },
    {
        email: "emily.nguyen@journeyhome.org",
        password: "password",
        first: "Emily",
        last: "Nguyen",
        dob: Timestamp.fromDate(new Date("1996-09-12T09:25:00")),
        role: "Case Manager",
    },
    {
        email: "michael.robinson@journeyhome.org",
        password: "password",
        first: "Michael",
        last: "Robinson",
        dob: Timestamp.fromDate(new Date("1989-01-18T15:40:00")),
        role: "Case Manager",
    },
    {
        email: "olivia.hughes@journeyhome.org",
        password: "password",
        first: "Olivia",
        last: "Hughes",
        dob: Timestamp.fromDate(new Date("1994-04-11T08:05:00")),
        role: "Case Manager",
    },
    {
        email: "daniel.kim@journeyhome.org",
        password: "password",
        first: "Daniel",
        last: "Kim",
        dob: Timestamp.fromDate(new Date("1992-12-03T17:10:00")),
        role: "Case Manager",
    },
    {
        email: "natalie.foster@journeyhome.org",
        password: "password",
        first: "Natalie",
        last: "Foster",
        dob: Timestamp.fromDate(new Date("1990-06-15T11:55:00")),
        role: "Case Manager",
    },
    {
        email: "ryan.bailey@journeyhome.org",
        password: "password",
        first: "Ryan",
        last: "Bailey",
        dob: Timestamp.fromDate(new Date("1995-02-28T14:45:00")),
        role: "Case Manager",
    },
    {
        email: "chloe.sanders@journeyhome.org",
        password: "password",
        first: "Chloe",
        last: "Sanders",
        dob: Timestamp.fromDate(new Date("1997-08-19T09:35:00")),
        role: "Case Manager",
    },
    {
        email: "ethan.price@journeyhome.org",
        password: "password",
        first: "Ethan",
        last: "Price",
        dob: Timestamp.fromDate(new Date("1993-10-07T12:20:00")),
        role: "Case Manager",
    },
    {
        email: "casemanager@test.com",
        password: "password",
        first: "CaseManager",
        last: "John",
        dob: Timestamp.fromDate(new Date("1993-10-07T12:20:00")),
        role: "Case Manager",
    },
];
const SEED_VOLUNTEERS = [
    {
        email: "volunteer@test.com",
        password: "password",
        first: "Volunteer",
        last: "John",
        dob: Timestamp.fromDate(new Date("1999-02-14T09:20:00")),
        role: "Volunteer",
    },
    {
        email: "alex.morgan@journeyhome.org",
        password: "password",
        first: "Alex",
        last: "Morgan",
        dob: Timestamp.fromDate(new Date("1999-02-14T09:20:00")),
        role: "Volunteer",
    },
    {
        email: "hannah.wright@journeyhome.org",
        password: "password",
        first: "Hannah",
        last: "Wright",
        dob: Timestamp.fromDate(new Date("2001-06-08T13:45:00")),
        role: "Volunteer",
    },
    {
        email: "liam.turner@journeyhome.org",
        password: "password",
        first: "Liam",
        last: "Turner",
        dob: Timestamp.fromDate(new Date("1998-11-21T10:30:00")),
        role: "Volunteer",
    },
    {
        email: "zoe.bennett@journeyhome.org",
        password: "password",
        first: "Zoe",
        last: "Bennett",
        dob: Timestamp.fromDate(new Date("2000-04-03T16:10:00")),
        role: "Volunteer",
    },
    {
        email: "noah.rivera@journeyhome.org",
        password: "password",
        first: "Noah",
        last: "Rivera",
        dob: Timestamp.fromDate(new Date("1997-09-12T08:55:00")),
        role: "Volunteer",
    },
    {
        email: "grace.hall@journeyhome.org",
        password: "password",
        first: "Grace",
        last: "Hall",
        dob: Timestamp.fromDate(new Date("2002-01-30T14:05:00")),
        role: "Volunteer",
    },
    {
        email: "jacob.morris@journeyhome.org",
        password: "password",
        first: "Jacob",
        last: "Morris",
        dob: Timestamp.fromDate(new Date("1996-07-18T11:50:00")),
        role: "Volunteer",
    },
    {
        email: "maya.edwards@journeyhome.org",
        password: "password",
        first: "Maya",
        last: "Edwards",
        dob: Timestamp.fromDate(new Date("2001-10-25T09:40:00")),
        role: "Volunteer",
    },
    {
        email: "caleb.jenkins@journeyhome.org",
        password: "password",
        first: "Caleb",
        last: "Jenkins",
        dob: Timestamp.fromDate(new Date("1999-05-06T12:35:00")),
        role: "Volunteer",
    },
    {
        email: "ella.howard@journeyhome.org",
        password: "password",
        first: "Ella",
        last: "Howard",
        dob: Timestamp.fromDate(new Date("2000-12-17T15:25:00")),
        role: "Volunteer",
    },
];

async function seedUsers() {
    for (const user of SEED_USERS.concat(SEED_VOLUNTEERS)) {
        const cred = await createUserWithEmailAndPassword(
            auth,
            user.email,
            user.password
        );

        const uid = cred.user.uid; // auto-generated by Firebase

        await setDoc(doc(db, "users", uid), {
            uid, // store it in document too
            firstName: user.first,
            lastName: user.last,
            dob: user.dob,
            role: user.role,
            email: user.email,
            pending: (user.role === "Volunteer" && Math.random() > 0.75) ? "Case Manager" : null,
            emailVerified: false,
        });
    }
}

async function accountReqs() {
    console.log("Seeding pending account requests...");

    for (const user of SEED_REQS) {
        // Generate a mock UID to serve as both the doc ID and the stored uid field
        const uid = crypto.randomUUID(); 

        // Map your seed data to match the screenshot schema exactly
        const pendingUserData = {
            dob: user.dob,
            email: user.email,
            emailVerified: false,
            firstName: user.first,
            lastName: user.last,
            pending: user.role,   // The role they are applying for (e.g., "Admin")
            role: "Volunteer",    // The default role before approval
            uid: uid,
        };

        try {
            await setDoc(doc(db, "users", uid), pendingUserData);
            console.log(`Created pending request for: ${user.email}`);
        } catch (error) {
            console.error(`Failed to create request for ${user.email}:`, error);
        }
    }
}

//seedUsers();
// async function assignDonationRequestToTimeBlock(
//     timeBlockId: string,
//     donationRequest: DonationRequest | ClientRequest
// ): Promise<void> {
//     if (!timeBlockId) throw new Error("No TimeBlock ID provided");
//     if (!donationRequest) throw new Error("No DonationRequest ID provided");

//     const blockRef = doc(db, TIMEBLOCK, timeBlockId);

//     const old = (await (await getDoc(blockRef)).data()) as TimeBlock;

//     await setDoc(blockRef, {
//         ...old,
//         tasks: old.tasks.concat([donationRequest]),
//     } as TimeBlock);
// }

// async function getRandomAvailableTimeBlock(): Promise<TimeBlock | null> {
//     const snapshot = await getDocs(collection(db, TIMEBLOCK));

//     const available = snapshot.docs.map((doc) => doc.data() as TimeBlock);

//     if (available.length === 0) return null;

//     return available[Math.floor(Math.random() * available.length)];
// }

function generateTimeBlocks() {
    const now = new Date();
    const targetCount = 50;

    // Build all weekday 1-hour slots (9am–5pm) for the next 14 days
    const candidates: Array<{ start: Date; end: Date }> = [];

    for (let dayOffset = 0; dayOffset < 180; dayOffset++) {
        const date = new Date(now);
        date.setDate(now.getDate() + dayOffset);

        const day = date.getDay();
        if (day === 0 || day === 6) continue; // skip weekends

        for (let hour = 9; hour < 17; hour++) {
            const start = new Date(date);
            start.setHours(hour, 0, 0, 0);

            const end = new Date(date);
            end.setHours(hour + 1, 0, 0, 0);

            candidates.push({ start, end });
        }
    }

    // Shuffle (Fisher–Yates)
    for (let i = candidates.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }

    const TIMEBLOCK_NAMES = [
        ...Array(14).fill("General Volunteering"),
        "Hartford Public High School ONLY",
        "University of Hartford ONLY",
        "Trinity College ONLY",
        "Capital Community College ONLY",
        "Travelers Insurance ONLY",
        "Aetna ONLY",
        "St. Francis Hospital ONLY",
        "Hartford Hospital ONLY",
        "Boy Scouts Troop 42 ONLY",
        "First Baptist Church ONLY",
        "YMCA of Greater Hartford ONLY",
        "Rotary Club of Hartford ONLY",
    ];

    const volunteersGroup = () => ({
        name: "Volunteers",
        maxNum: Math.floor(Math.random() * 10) + 1,
        volunterIDs: [] as string[],
    });
    const leadDriversGroup = () => ({
        name: "Lead Drivers ONLY",
        maxNum: Math.floor(Math.random() * 3) + 1,
        volunterIDs: [] as string[],
    });

    // Select random 50 and map to TimeBlocks
    return candidates.slice(0, targetCount).map(({ start, end }) => {
        const isWarehouse = Math.random() < 0.15;
        const name = isWarehouse
            ? "Warehouse Organizing"
            : TIMEBLOCK_NAMES[Math.floor(Math.random() * TIMEBLOCK_NAMES.length)];
        const volunteerGroups = isWarehouse
            ? [volunteersGroup()]
            : [volunteersGroup(), leadDriversGroup()];
        return {
            id: crypto.randomUUID(),
            name,
            notes: "",
            type: (isWarehouse) ? "Warehouse" : "Pickup/Delivery",
            tasks: [],
            startTime: Timestamp.fromDate(start),
            endTime: Timestamp.fromDate(end),
            volunteerGroups,
            published: false,
        } as TimeBlock;
    });
}

export async function seedTimeBlocks() {
    const blocks = generateTimeBlocks();

    for (const block of blocks) {
        await setDoc(doc(db, TIMEBLOCK, block.id), block);
    }

    console.log("Seeded time blocks:", blocks.length);
}
function randomHMIS(): string {
    return Math.floor(10 ** 12 + Math.random() * 9 * 10 ** 12).toString();
}


async function addCaseManagerRequests(count: number) {
    const snapshot = await getDocs(collection(db, "users"));
    const caseManagers = snapshot.docs
        .map((d) => d.data() as UserData)
        .filter((u) => u.role === "Case Manager");

    if (caseManagers.length === 0) return;

    for (let i = 0; i < count; i++) {
        const randomCaseManager = caseManagers[Math.floor(Math.random() * caseManagers.length)];
        const baseClient: LocationContact = randomFrom(SEED_DONORS);

        const numItemsNeeded = Math.floor(Math.random() * 4) + 1;

        // 2. Grab unique categories so they don't request "Sofas" twice
        const shuffledCategories = [...DEFAULT_CATEGORIES].sort(() => Math.random() - 0.5);
        const selectedCategories = shuffledCategories.slice(0, numItemsNeeded);

        // 3. Build the items array with random quantities for each category
        const requestedItems = selectedCategories.map((category) => ({
            name: category,
            quantity: Math.floor(Math.random() * 3) + 1, // Assigns 1, 2, or 3 of this item
        }));

        const request: ClientRequest = {
            id: crypto.randomUUID(),

            client: {
                ...baseClient,

                hmis: randomHMIS(),
                programName: "Seed Data Program",

                secondaryContact: {
                    name: randomFrom(SEED_DONORS).firstName +
                        " " +
                        randomFrom(SEED_DONORS).lastName,
                    relationship: randomFrom([
                        "Friend",
                        "Sibling",
                        "Parent",
                        "Neighbor",
                    ]),
                    phone: "860-555-" + Math.floor(1000 + Math.random() * 9000),
                },

                questions: {
                    clientSpeaksEnglish: Math.random() > 0.3,
                    adultsInFamily: Math.floor(Math.random() * 3) + 1,
                    childrenInFamily: Math.floor(Math.random() * 4),
                    isVeteran: randomFrom(["Yes", "No", "Unsure"] as const),
                    canPickUp: Math.random() > 0.5,
                    wasChronic: randomFrom(["Yes", "No", "Unsure"] as const),
                    hasMovedIn: Math.random() > 0.5,
                    moveInDate: Timestamp.fromDate(new Date()),
                    hasElevator: Math.random() > 0.5,
                    notes: randomFrom(CLIENT_NOTES),
                },
            },

            caseManagerID: randomCaseManager.uid,
            notes: randomFrom(CASE_NOTES),
            status: "Not Reviewed",

            items: requestedItems,

            associatedTimeBlockID: null,
            date: randomTimestamp(60)
        };

        await setCaseRequest(request);
        console.log("Created case manager request:", request.id);
    }
}

const CASE_NOTES = [
    "Tape color: BLUE. Keep all pieces together on a single pallet by the loading dock; double-check the overall dimensions before wrapping.",
    "Assigned tape: RED. Heavy load in this order! Make sure to send at least two volunteers to lift and move the larger pieces.",
    "Tape: YELLOW. Watch out for fragile components. Please wrap everything an extra time just to be safe.",
    "Tape color: GREEN. Leave this order in Aisle 4 until the client arrives. They are bringing a smaller vehicle, so we will need to pack it tight.",
    "Tape: ORANGE. Please verify the client's HMIS number before handing over the items. Make sure any moving parts or doors are taped shut before transporting.",
    "Assigned tape: PURPLE. Load the heaviest items first, and make sure to grab any ziplock bags of hardware attached to the back.",
    "Tape color: PINK. The client is moving into a 3rd-floor walkup, so please pick the lightest available options from the floor if there are duplicates.",
    "Tape: WHITE. Wipe everything down before loading. Stack the items carefully to avoid scratching the finishes.",
    "Assigned tape: LIGHT BLUE. Put any soft goods in the truck last so they can be carried in first at the destination.",
    "Tape color: NEON YELLOW. Grab these from the overflow storage area. Please do a quick quality check for any missing parts before staging.",
    "Tape: BLACK. Needs an extra wipe-down. Stack the smaller items on top of the heavier pieces to save space on the dolly.",
    "Assigned tape: NEON ORANGE. Client will have help loading, but stage the order close to Bay 2 so they don't have to carry it far.",
    "Tape color: DARK GREEN. Check the inventory tags to ensure these are the exact pieces requested; we have a few similar ones on the floor.",
    "Tape: NAVY. Leave the protective plastic on everything until it's fully loaded into their vehicle.",
    "Assigned tape: SILVER. Wrap the edges in cardboard before loading to prevent corner damage during transport."
];

const CLIENT_NOTES = [
    "Client recently moved into permanent housing and is missing essential furniture.",
    "Family transitioning from shelter; basic household setup needed.",
    "Client requested delivery due to lack of transportation.",
    "Apartment is on second floor, stairs only.",
    "Client prefers communication via phone call in the afternoon.",
    "Move-in date confirmed, needs items before end of week.",
    "Client has limited mobility and may need assistance unloading.",
    "Housing voucher recently approved; furniture needed urgently.",
    "Client currently sleeping on air mattress, requesting bed setup.",
    "Small apartment — space-conscious furniture preferred.",
    "Client works evenings, delivery requested before 3 PM.",
    "Newly housed veteran, prioritizing bedroom furniture.",
    "Family with young children, requesting dining table and chairs.",
    "Client requested minimal contact delivery if possible.",
    "Building requires check-in with front desk upon arrival.",
    "Client recently relocated from another city; no existing furniture.",
    "Elevator available but small — large items may be difficult.",
    "Client prefers neutral-colored furniture if available.",
    "Pet in household — avoid fragile items if possible.",
    "Client available on weekends only for deliveries.",
    "Case manager emphasized urgency for couch and mattress.",
    "Temporary housing ending soon; expedited request preferred.",
    "Client expressed gratitude and flexibility on item condition.",
    "Parking near building is limited; short unloading window.",
    "Client requested text updates before arrival.",
    "Family size increased recently, additional seating requested.",
    "Client is starting new job and requested delivery flexibility.",
    "Items needed to help child transition into new room.",
    "Client has back pain; requested supportive mattress if available.",
    "Apartment access through side entrance only.",
];
export default function page() {
    const btnClass = "border border-gray-400 rounded px-6 py-2 hover:bg-gray-100 text-sm w-64";

    return (
        <div className="flex flex-col gap-8 m-10 items-center">
            <Toaster />
            <button
                className="border-2 border-black rounded-lg px-10 py-6 text-2xl font-bold hover:bg-gray-100"
                onClick={() => {
                    const promise = (async () => {
                        await seedUsers();
                        await ensureCategoriesConfig();
                        await seedTimeBlocks();
                        for (let i = 0; i < 5; i++) await addDonationRequests(true);
                        for (let i = 0; i < 20; i++) await addDonationRequests(false);
                        await addCaseManagerRequests(7);
                        await seedInventoryChanges(50);
                    })();
                    toast.promise(promise, {
                        loading: "Seeding all test data...",
                        success: "All test data seeded!",
                        error: "Something went wrong while seeding data.",
                    });
                }}
            >
                Set All Test Data
            </button>

            <div className="flex flex-col gap-3 items-center">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Granular data stuff</p>
                <button className={btnClass} onClick={() => seedUsers()}>
                    Add users
                </button>
                <button className={btnClass} onClick={() => accountReqs()}>
                    Add account requests
                </button>
                <button className={btnClass} onClick={() => ensureCategoriesConfig()}>
                    Add config
                </button>
                <button className={btnClass} onClick={() => seedTimeBlocks()}>
                    Add time blocks
                </button>
                <button
                    className={btnClass}
                    onClick={async () => {
                        await Promise.all(
                            Array.from({ length: 5 }, () => addDonationRequests())
                        );
                    }}
                >
                    Add donation requests
                </button>
                <button
                    className={btnClass}
                    onClick={() => ensureCategoriesConfig()}
                >
                    Add inventory categories
                </button>
                <button className={btnClass} onClick={() => addCaseManagerRequests(7)}>
                    Add client requests
                </button>
                <button className={btnClass} onClick={() => seedInventoryChanges(50)}>
                    Add Warehouse Logs
                </button>
            </div>
        </div>
    );
}

const randomFrom = <T,>(arr: T[]): T =>
    arr[Math.floor(Math.random() * arr.length)];

// function getRandom<T>(arr: readonly T[]): T {
//     return arr[Math.floor(Math.random() * arr.length)];
// }
