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
  { id: "1", name: "Martin Gouse", quantity: 3, date: "9/22/2025", status: "Unfinished", responded: false, category: "Couches" },
  { id: "2", name: "John Doe", quantity: 1, date: "9/22/2025", status: "Finished", responded: true, category: "Chairs" },
  { id: "3", name: "Talan Donin", quantity: 1, date: "9/22/2025", status: "Finished", responded: true, category: "Tables" },
  { id: "4", name: "Roger Lipshutz", quantity: 5, date: "9/22/2025", status: "Unfinished", responded: false, category: "Couches" },
  { id: "5", name: "Erin Donin", quantity: 2, date: "9/22/2025", status: "Unfinished", responded: false, category: "Chairs" },
  { id: "6", name: "Livia Passaquindici Arcand", quantity: 7, date: "9/22/2025", status: "Finished", responded: true, category: "Tables" },
  { id: "7", name: "Brandon Schleifer", quantity: 1, date: "9/22/2025", status: "Finished", responded: true, category: "Chairs" },
  { id: "8", name: "Zain Rosser", quantity: 1, date: "9/22/2025", status: "Not reviewed", responded: false, category: "Couches" },
  { id: "9", name: "Craig Stanton", quantity: 3, date: "9/22/2025", status: "Not reviewed", responded: false, category: "Tables" },
  { id: "10", name: "Nolan Gouse", quantity: 8, date: "9/22/2025", status: "Not reviewed", responded: false, category: "Chairs" },
  { id: "11", name: "James Vetrov", quantity: 1, date: "9/22/2025", status: "Finished", responded: true, category: "Couches" },
  { id: "12", name: "Ann Lipshutz", quantity: 2, date: "9/22/2025", status: "Finished", responded: true, category: "Tables" },
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