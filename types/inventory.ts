import { Timestamp } from "firebase/firestore";

export type InventoryPhoto = {
  url: string;
  altText: string;
}

export type InventoryRecordData = {
  name: string;
  thumbnail: InventoryPhoto;
  otherPhotos: InventoryPhoto[];
  category: string;
  notes: string;
  quantity: number;
  dateAdded: Timestamp;
}

export type InventoryRecord extends InventoryRecordData {
  id: string; // this is the document ID assigned by Firebase
}

export type SearchFilters = {
  category: string | undefined;
  minStock: number | undefined;
  maxStock: number | undefined;
};

export type SortBy = ""
