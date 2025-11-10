import { Timestamp } from "firebase/firestore";

export type InventoryPhoto = {
  url: string,
  altText: string,
};

export type InventoryRecord = {
  id: string,
  name: string,
  photos: InventoryPhoto[],
  category: string,
  notes: string,
  quantity: number,
  size: "Small" | "Medium" | "Large",
  dateAdded: Timestamp,
  donorEmail: string | null,
};

export type SearchParams = {
  categories: string[],
  sizes: string[],
  sortBy: "Quantity" | "Date" | "Name",
  ascending: boolean
};

export type SortStatus = "asc" | "desc" | "none";