"use client";

import { setInventoryCategory } from "@/lib/services/inventory";
import { InventoryCategory } from "@/types/inventory";
import { Timestamp } from "@firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast, Toaster } from "sonner";
import { v4 as uuidv4 } from "uuid";

const CATEGORY_NAMES: Omit<InventoryCategory, "id" | "quantity">[] = [
    { name: "Mattresses",        icon: "box", lowThreshold: 5,  highThreshold: 10 },
    { name: "Box Springs",       icon: "box", lowThreshold: 5,  highThreshold: 10 },
    { name: "Sofas",             icon: "box", lowThreshold: 3,  highThreshold: 7  },
    { name: "Loveseats",         icon: "box", lowThreshold: 3,  highThreshold: 6  },
    { name: "Kitchen Tables",    icon: "box", lowThreshold: 4,  highThreshold: 8  },
    { name: "Kitchen Chairs",    icon: "box", lowThreshold: 8,  highThreshold: 15 },
    { name: "Armchairs",         icon: "box", lowThreshold: 4,  highThreshold: 8  },
    { name: "Coffee Tables",     icon: "box", lowThreshold: 4,  highThreshold: 8  },
    { name: "Dressers",          icon: "box", lowThreshold: 5,  highThreshold: 10 },
    { name: "Nightstands",       icon: "box", lowThreshold: 6,  highThreshold: 12 },
    { name: "TVs",               icon: "box", lowThreshold: 3,  highThreshold: 6  },
    { name: "TV Stands",         icon: "box", lowThreshold: 3,  highThreshold: 6  },
    { name: "Microwave Stands",  icon: "box", lowThreshold: 4,  highThreshold: 8  },
    { name: "Small Bookshelves", icon: "box", lowThreshold: 4,  highThreshold: 8  },
    { name: "Area Rugs",         icon: "box", lowThreshold: 5,  highThreshold: 10 },
    { name: "End Tables",        icon: "box", lowThreshold: 5,  highThreshold: 10 },
];

const TEST_ACCOUNTS = [
    { email: "admin@test.com",        password: "password", first: "Admin",       last: "Test", role: "Admin",        phone: "555-000-0001", waiver: false },
    { email: "casemanager@test.com",  password: "password", first: "CaseManager", last: "Test", role: "Case Manager", phone: "555-000-0002", waiver: false },
    { email: "volunteer@test.com",    password: "password", first: "Volunteer",   last: "Test", role: "Volunteer",    phone: "555-000-0003", waiver: true  },
];

async function addMinimumData() {
    for (const user of TEST_ACCOUNTS) {
        const cred = await createUserWithEmailAndPassword(auth, user.email, user.password);
        await setDoc(doc(db, "users", cred.user.uid), {
            uid: cred.user.uid,
            firstName: user.first,
            lastName: user.last,
            email: user.email,
            phone: user.phone,
            createdTime: Timestamp.now(),
            signedWaiver: null,
            disabled: false,
            role: user.role,
            pending: null,
            emailVerified: false,
        });
    }

    await Promise.all(CATEGORY_NAMES.map((cat) => setInventoryCategory({ ...cat, id: uuidv4(), quantity: cat.highThreshold + 5 })));
}

export default function page() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <Toaster />
            <button
                className="border-2 border-black rounded-lg px-10 py-6 text-2xl font-bold hover:bg-gray-100"
                onClick={() => {
                    toast.promise(addMinimumData(), {
                        loading: "Adding minimum data...",
                        success: "Done! 3 accounts + inventory categories added.",
                        error: (e) => `Error: ${e?.message ?? "Something went wrong"}`,
                    });
                }}
            >
                Add Minimum Data
            </button>
            <p className="text-sm text-gray-500">
                Creates admin@test.com, casemanager@test.com, volunteer@test.com (password: password) + inventory categories
            </p>
        </div>
    );
}
