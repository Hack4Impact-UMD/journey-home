import { Timestamp } from "firebase/firestore";

export type InventoryPhoto = {
  url: string;
  altText: string;
};

export type InventoryRecordData = {
  name: string;
  thumbnail: InventoryPhoto;
  otherPhotos: InventoryPhoto[];
  category: string;
  notes: string;
  quantity: number;
  size: "Small" | "Medium" | "Large";
  dateAdded: Timestamp;
};

export type InventoryRecord = InventoryRecordData & {
  id: string; // this is the document ID assigned by Firebase
};

export type SearchParams = {
  categories: string[],
  sizes: string[],
  sortBy: "Quantity" | "Date" | "Name",
  ascending: boolean
};
