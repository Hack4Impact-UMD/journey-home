"use client"


import { createDonationRequest } from "@/lib/services/donations"
import { setInventoryRecord, uploadImage } from "@/lib/services/inventory";
import { DonationItem, DonationRequest } from "@/types/donations";
import { InventoryPhoto } from "@/types/inventory";
import { Timestamp, updateDoc } from "@firebase/firestore";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { LocationContact } from "@/types/general";
import { ClientRequest } from "@/types/client-requests";
import { AuthContextType } from "@/types/user";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { TimeBlock } from "@/types/schedule";
import { collection, getDocs } from "firebase/firestore";



const CASEREQUEST = "case-requests";
const TIMEBLOCK = "timeblocks";

export const SEED_DONORS: LocationContact[] = [
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
export const ITEM_DESCRIPTIONS: Record<string, string[]> = {
  Sofas: [
    "Gray L-shaped Sofa",
    "Brown L-shaped Sofa",
    "Green Sofa",
    "Massive Gray Sofa"
  ],
  Dressers: [
    "Orange ish colored dresser thing",
    "Sleek black dresser",
    "White dresser",
    "dark brown dresser"
  ],
  "Kitchen Tables": [
    "White Modern Kitchen Table",
    "Brown and Green Kitchen Table",
    "Red-Brown Kitchen Table",
    "Light Brown Kitchen Table"
  ],
  "Area Rugs": [
    "Persian Area Rug",
    "Black and White Area Rug",
    "Character Area Rug",
    "Thick Area Rug(Cat not included)"
  ],
  Armchairs: [
    "Beige Armchair",
    "Fancy Old Armchair",
    "Jaymar Post Modern Sculptural Tongue Armchair",
    "Throne Armchair"
  ],
  "Box Springs": [
    "Box Spring Queen",
    "Queen Sized Box Spring",
    "Tempur-pedic King Sized Box Spring",
    "Twin Box Spring"
  ],
  "Coffee Tables": [
    "Circular Gear Coffee Table",
    "Pear-Shaped Coffee Table",
    "White Modern Coffee Table",
    "Glass Coffee Table"
  ],
  "End Tables": [
    "Brown End Table",
    "Skinny Brown End Table",
    "Unique Mosaic End Table",
    "Circular Solid Wood End Table"
  ],
  "Kitchen Chairs": [
    "Modern Black Dining Table Chairs",
    "Camel Leather Dining Chairs",
    "Set of 5 Gray Dining Chairs",
    "Uncomfortable Kitchen Chairs"
  ],
  Loveseats: [
    "Gray Loveseat",
    "Brown Microfiber Suede Loveseat",
    "Gray rectangular loveseat",
    "Confusing Loveseat"
  ],
  Mattresses: [
    "Queen Sized 10 Inch Mattress",
    "Twin Sized Mattress",
    "Queen Sized Mattress",
    "Full Sized Mattress"
  ],
  "Microwave Stands": [
    "Dark Brown Microwave Stand",
    "Dual Shade Microwave Stand",
    "Kitchen and Microwave Stand",
    "Ikea Microwave Stand"
  ],
  Nightstands: [
    "Dark green nightstand",
    "Wood Nightstand with metal legs",
    "Maple Nightstand",
    "Dark Brown nightstand"
  ],
  "Small Bookshelves": [
    "Little Blue Bookshelf",
    "Ladder Bookshelf",
    "Small Dark Brown Bookshelf",
    "Skinny Bookshelf"
  ],
  "TV Stands": [
    "Rusted brown tv stand",
    "Deep brown TV stand",
    "Low Brown IKEA TV stand",
    "Shiny Brown TV Stand"
  ],
  TVs: [
    "75 inch ROKU TV",
    "Vizio 40in 1080p Smart TV",
    "45in Samsung TV",
    "9in CRT TV w/ VCR"
  ]

};
type SeedImage = {
  file: File;
  title: string;
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
async function seedImageToPhotos(
  seed: SeedImage
): Promise<InventoryPhoto[]> {
  return [
    {
      url: await uploadImage(seed.file),
      altText: seed.title,
    },
  ];
}



async function addDonationRequests(category: string) {
    const validSizes = ["Small", "Medium", "Large"] as const;
    const time = randomTimestamp();
    const imagePool = await getSeedImagePool(category);

    const donor: LocationContact = randomFrom(SEED_DONORS);
    const randomBlock = await getRandomAvailableTimeBlock();

    const items: DonationItem[] = [];

    for (const seedImage of imagePool) {
        items.push({
            item: {
                id: crypto.randomUUID(),
                name: seedImage.title,
                category,
                size: getRandom(validSizes),
                quantity: 1,
                notes: randomFrom(desc),
                dateAdded: time,
                donorEmail: donor.email,
                photos: await seedImageToPhotos(seedImage),
            },
            status: "Not Reviewed",
        });
    }

    const request: DonationRequest = {
        id: crypto.randomUUID(),
        donor,
        firstTimeDonor: Math.random() > 0.5,
        howDidYouHear: randomFrom([
            "Instagram",
            "Friend",
            "Flyer",
            "Website",
        ]),
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
        items,
        associatedTimeBlockID: randomBlock?.id ?? null,
    };
    if(randomBlock !== null) {
          assignDonationRequestToTimeBlock(randomBlock.id, request);

    }

    console.log("creating donation request");
    await createDonationRequest(request);
}


async function addInventoryRecord(category: string) {
  const validSizes = ["Small", "Medium", "Large"] as const;
    const time = randomTimestamp();
    const imagePool = await getSeedImagePool(category);
  for (const image of imagePool) {
    const donor:LocationContact = randomFrom(SEED_DONORS);

    await setInventoryRecord({
      id: crypto.randomUUID(),
      name: image.title,
      category,
      size: getRandom(validSizes),
      quantity: 1,
      notes: randomFrom(desc),
      dateAdded: time,
      donorEmail: donor.email,
      photos: await seedImageToPhotos(image),
    });
  
  }
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
    const title = ITEM_DESCRIPTIONS[category]?.[i] || "Other";
    const url = getPublicUrl(`/seed-images/${category}/${imageNames[i]}`);
    const res = await fetch(url);
    const blob = await res.blob();
    const file = new File([blob], title, { type: blob.type });

    filesWithDescriptions.push({ file, title });
  }

  return filesWithDescriptions;
}

 async function setCaseRequest(
    record: ClientRequest
): Promise<boolean> {
    try {
        const docRef = doc(db, CASEREQUEST, record.id);
        await setDoc(docRef, record);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}


const DEFAULT_CATEGORIES = [
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
  "Other",
];
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
  "Hand-Crafted Details: Item has handmade or delicate elements that require gentle handling. Overall condition is good."
];
export async function ensureCategoriesConfig() {
  const ref = doc(db, "config", "categories");
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, { categories: DEFAULT_CATEGORIES });
    console.log("Created categories config");
  }
}

export async function ensureCaseRequests() {
  const ref = doc(db, "case-requests", "init");
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {created: true});
    console.log("Created case requests");
  }
}

export const SEED_USERS = [
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
];
const SEED_VOLUNTEERS = [
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
  for (const user of SEED_VOLUNTEERS) {
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
      pending: null,
      emailVerified: false,
    });
  }
}

//seedUsers();
async function assignDonationRequestToTimeBlock(
  timeBlockId: string,
  donationRequest: DonationRequest | ClientRequest
): Promise<void> {
  if (!timeBlockId) throw new Error("No TimeBlock ID provided");
  if (!donationRequest) throw new Error("No DonationRequest ID provided");

  const blockRef = doc(db, TIMEBLOCK, timeBlockId);

  await updateDoc(blockRef, {
    task: donationRequest, // assuming `task` can store the donation request ID
  });
}

async function getRandomAvailableTimeBlock(): Promise<TimeBlock | null> {
  const snapshot = await getDocs(collection(db, TIMEBLOCK));

  const available = snapshot.docs
    .map(doc => doc.data() as TimeBlock)
    .filter(block => block.task === null);

  if (available.length === 0) return null;

  return available[Math.floor(Math.random() * available.length)];
}

function generateTimeBlocks() {
  const now = new Date();
  const targetCount = 20; // 10–15 blocks

  // Build all weekday 1-hour slots (9am–5pm) for the next 14 days
  const candidates: Array<{ start: Date; end: Date }> = [];

  for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
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

  // Select random 10–15 and map to TimeBlocks
  return candidates.slice(0, targetCount).map(({ start, end }) => ({
    id: crypto.randomUUID(),
    task: null,
    startTime: Timestamp.fromDate(start),
    endTime: Timestamp.fromDate(end),
    volunteerIDs: [],
    maxVolunteers: Math.floor(Math.random() * 10) + 1,
    published: false,
  }));
}

export async function seedTimeBlocks() {
  const blocks = generateTimeBlocks();

  for (const block of blocks) {
    await setDoc(doc(db, TIMEBLOCK, block.id), block);
  }

  console.log("Seeded time blocks:", blocks.length);
}
function randomHMIS(): string {
  return Math.floor(
    10 ** 12 + Math.random() * 9 * 10 ** 12
  ).toString();
}
async function addCaseManagerRequests(count: number) {
  for (let i = 0; i < count; i++) {
    const randomBlock = await getRandomAvailableTimeBlock();

    if (!randomBlock) {
      console.log("No available time blocks left");
      break;
    }

    // base location contact
    const baseClient: LocationContact = randomFrom(SEED_DONORS);

    const request: ClientRequest = {
      id: crypto.randomUUID(),

      client: {
        ...baseClient, // <-- uses your LocationContact correctly

        hmis: randomHMIS(),

        secondaryContact: {
          name:
            randomFrom(SEED_DONORS).firstName +
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
          isVeteran: Math.random() > 0.8,
          canPickUp: Math.random() > 0.5,
          wasChronic: Math.random() > 0.7,
          hasMovedIn: Math.random() > 0.5,
          moveInDate: Timestamp.fromDate(new Date()),
          hasElevator: Math.random() > 0.5,
          notes: randomFrom(CLIENT_NOTES),
        },
      },

      caseManagerID: crypto.randomUUID(),
      notes: randomFrom(desc),
      status: "Not Reviewed",

      items: [
        {
          name: randomFrom(DEFAULT_CATEGORIES),
          quantity: Math.floor(Math.random() * 3) + 1,
        },
      ],

      associatedTimeBlockID: randomBlock.id,
    };

    await setCaseRequest(request);

    // mark block as used (optional but recommended)
    await assignDonationRequestToTimeBlock(
      randomBlock.id,
      request
    );

    console.log("Created case manager request:", request.id);
  }
}

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
    return(
        <>
        <button onClick={() => {
            addDonationRequests("Sofas")
        }}>add sofas</button>
        <button onClick={() => {
            addDonationRequests("Dressers")
        }}>add dressers</button>
        <button onClick={() => {
            addDonationRequests("Kitchen Tables")
        }}>add tables</button>

        <button onClick={() => {
            addInventoryRecord("Sofas")
        }}>add sofa inventory</button>
        <button onClick={() => {
            addInventoryRecord("Dressers")
        }}>add dresser inventory</button>
        <button onClick={() => {
            addInventoryRecord("Kitchen Tables")
        }}>add table inventory</button>
        
        {/* <button onClick={() => {
            ensureCategoriesConfig()
        }}> ADD CONFIG</button> */}

        <button onClick={() => {
          ensureCaseRequests()
        }}>Button to make case-requests</button>

        <br></br>
        <button onClick={()=> {
          seedTimeBlocks();
        }}>TIME BLOCKSdsadasdasd</button>


        <button onClick={() => {
          addCaseManagerRequests(4);
        }}>ADD 4 CASE MANAGERS                    </button>
        <button onClick={ () => {
            const promises = DEFAULT_CATEGORIES
      .filter(category => category !== "Other")
      .map(category => addDonationRequests(category));

    Promise.all(promises);
        }}> Epic Mega Button to Add All Different Donation Requests</button>
        <br />
        <button onClick={ () => {
            const promises = DEFAULT_CATEGORIES
      .filter(category => category !== "Other")
      .map(category => addInventoryRecord(category));

    Promise.all(promises);
        }}> Epic Mega Button to Add All Different Inventory Records</button>
        
        <br />

    <button onClick={() => {
      seedUsers();
    }}>Cool button to add users</button>
    </>
    );

    
}

const randomFrom = <T,>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

function getRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}