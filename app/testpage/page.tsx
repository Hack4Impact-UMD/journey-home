"use client"


import { createDonationRequest } from "@/lib/services/donations"
import { setInventoryRecord, uploadImage } from "@/lib/services/inventory";
import { DonationItem, DonationRequest } from "@/types/donations";
import { InventoryPhoto } from "@/types/inventory";
import { Timestamp } from "@firebase/firestore";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { LocationContact } from "@/types/general";

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
    };
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

        <br></br>

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
        </>
    );
}

const randomFrom = <T,>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

function getRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}