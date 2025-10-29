// inventory/data.ts
import { Item, DonationItem, StockItem } from "./types";

export const ITEMS: Item[] = [
  { id: "1", name: "Leather Sectional", category: "Couches", quantity: 5, addedAt: "9/22" },
  { id: "2", name: "Velvet Loveseat", category: "Couches", quantity: 3, addedAt: "9/20" },
  { id: "3", name: "Dining Table", category: "Tables", quantity: 2, addedAt: "9/19" },
  { id: "4", name: "Recliner", category: "Chairs", quantity: 4, addedAt: "9/16" },
  { id: "5", name: "Coffee Table", category: "Tables", quantity: 1, addedAt: "9/10" },
  { id: "6", name: "Armchair", category: "Chairs", quantity: 6, addedAt: "9/08" },
];

export const DONATIONS: DonationItem[] = [
  { id: "1", name: "Martin Gouse", quantity: 3, date: "9/22/2025", status: "Unfinished", responded: false, category: "Clothing" },
  { id: "2", name: "John Doe", quantity: 1, date: "9/22/2025", status: "Finished", responded: true, category: "Electronics" },
  { id: "3", name: "Talan Donin", quantity: 1, date: "9/22/2025", status: "Finished", responded: true, category: "Furniture" },
  { id: "4", name: "Roger Lipshutz", quantity: 5, date: "9/22/2025", status: "Unfinished", responded: false, category: "Books" },
  { id: "5", name: "Erin Donin", quantity: 2, date: "9/22/2025", status: "Unfinished", responded: false, category: "Toys" },
  { id: "6", name: "Livia Passaquindici Arcand", quantity: 7, date: "9/22/2025", status: "Finished", responded: true, category: "Clothing" },
  { id: "7", name: "Brandon Schleifer", quantity: 1, date: "9/22/2025", status: "Finished", responded: true, category: "Electronics" },
  { id: "8", name: "Zain Rosser", quantity: 1, date: "9/22/2025", status: "Not reviewed", responded: false, category: "Books" },
  { id: "9", name: "Craig Stanton", quantity: 3, date: "9/22/2025", status: "Not reviewed", responded: false, category: "Furniture" },
  { id: "10", name: "Martin Gouse", quantity: 3, date: "9/22/2025", status: "Not reviewed", responded: false, category: "Clothing" },
  { id: "11", name: "Nolan Gouse", quantity: 8, date: "9/22/2025", status: "Not reviewed", responded: false, category: "Toys" },
  { id: "12", name: "James Vetrovs", quantity: 1, date: "9/22/2025", status: "Finished", responded: true, category: "Electronics" },
  { id: "13", name: "Ann Lipshutz", quantity: 2, date: "9/22/2025", status: "Finished", responded: true, category: "Books" },
  // Extra entries
  { id: "14", name: "Sarah Martinez", quantity: 4, date: "9/23/2025", status: "Not reviewed", responded: false, category: "Furniture" },
  { id: "15", name: "David Chen", quantity: 2, date: "9/23/2025", status: "Unfinished", responded: false, category: "Electronics" },
  { id: "16", name: "Emily Thompson", quantity: 6, date: "9/23/2025", status: "Finished", responded: true, category: "Clothing" },
  { id: "17", name: "Michael Brown", quantity: 1, date: "9/24/2025", status: "Not reviewed", responded: false, category: "Books" },
  { id: "18", name: "Jessica Wilson", quantity: 3, date: "9/24/2025", status: "Unfinished", responded: false, category: "Toys" },
];

// For approved/denied donations pages with full details
export const WAREHOUSE_ITEMS = [
  { id: "1", name: "Striped sofa", donor: "John Doe", category: "Sofa", size: "Small", quantity: 3, date: "9/22/2025", status: "Approved", photoUrl: "/sofa1.jpg", description: "Comfortable, gently used two-seater couch with a neutral striped fabric (beige and soft gray tones). Cushions are firm and supportive, with removable covers that can be washed. No major stains or damage, just normal wear from a few years of use. It's clean, sturdy, and has plenty of life left in it. Perfect for adding a cozy, welcoming spot to a new home.", email: "johndoe@gmail.com", phone: "6507724932", address: "124 Maplewood Drive, New Haven, CT 06511" },
  { id: "2", name: "Wooden chairs", donor: "Jane Smith", category: "Chair", size: "Medium", quantity: 1, date: "9/22/2025", status: "Approved", photoUrl: "/chair1.jpg", description: "Set of wooden dining chairs in excellent condition.", email: "jane@gmail.com", phone: "6501234567", address: "456 Oak Street, New Haven, CT 06511" },
  { id: "3", name: "Striped sofa", donor: "Mike Johnson", category: "Sofa", size: "Medium", quantity: 1, date: "9/22/2025", status: "Denied", photoUrl: "/sofa2.jpg", description: "Medium sized striped sofa with some wear.", email: "mike@gmail.com", phone: "6509876543", address: "789 Pine Avenue, New Haven, CT 06511" },
  { id: "4", name: "Wooden light brown table", donor: "Sarah Williams", category: "Coffee table", size: "Large", quantity: 5, date: "9/22/2025", status: "Approved", photoUrl: "/table1.jpg", description: "Beautiful wooden coffee table in great condition.", email: "sarah@gmail.com", phone: "6505551234", address: "321 Elm Drive, New Haven, CT 06511" },
  { id: "5", name: "Striped sofa", donor: "Tom Brown", category: "Sofa", size: "Large", quantity: 2, date: "9/22/2025", status: "Denied", photoUrl: "/sofa3.jpg", description: "Large striped sofa with minor stains.", email: "tom@gmail.com", phone: "6504567890", address: "654 Maple Lane, New Haven, CT 06511" },
  { id: "6", name: "Leather couch", donor: "Emily Davis", category: "Sofa", size: "Medium", quantity: 7, date: "9/22/2025", status: "Approved", photoUrl: "/couch1.jpg", description: "Leather couch in good condition.", email: "emily@gmail.com", phone: "6503334444", address: "987 Cedar Road, New Haven, CT 06511" },
  { id: "7", name: "Toaster", donor: "Chris Wilson", category: "Kitchen appliance", size: "Small", quantity: 1, date: "9/22/2025", status: "Denied", photoUrl: "/toaster.jpg", description: "Working toaster, slightly used.", email: "chris@gmail.com", phone: "6502223333", address: "147 Birch Street, New Haven, CT 06511" },
  { id: "8", name: "Office chair", donor: "Amy Lee", category: "Chair", size: "Small", quantity: 1, date: "9/22/2025", status: "Approved", photoUrl: "/chair2.jpg", description: "Comfortable office chair with wheels.", email: "amy@gmail.com", phone: "6501112222", address: "258 Willow Way, New Haven, CT 06511" },
];

export const STOCK: StockItem[] = [
  { label: "Sofas", value: 4, max: 15 },
  { label: "Coffee tables", value: 10, max: 15 },
  { label: "Chairs", value: 20, max: 25 },
  { label: "Kitchen appliances", value: 2, max: 15 },
  { label: "Mattresses", value: 8, max: 15 },
  { label: "Dressers", value: 2, max: 15 },
  { label: "TV's", value: 20, max: 25 },
  { label: "TV stands", value: 7, max: 15 },
  { label: "Coffee makers", value: 4, max: 15 },
  { label: "Microwave", value: 18, max: 20 },
  { label: "Area rugs", value: 21, max: 25 },
  { label: "Toasters", value: 4, max: 15 },
];