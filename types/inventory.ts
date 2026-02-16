import { Timestamp } from "firebase/firestore";

export type InventoryPhoto = {
  url: string,
  altText: string,
};

export type ItemSize = "Small" | "Medium" | "Large"

export type InventoryRecord = {
  id: string,
  name: string,
  photos: InventoryPhoto[],
  category: string,
  notes: string,
  quantity: number,
  size: ItemSize,
  dateAdded: Timestamp,
  donorEmail: string | null,
};

export type SortStatus = "asc" | "desc" | "none";

export type CategoryAttributes = {
  name: string,
  lowThreshold: number, // number separating yellow and red zone
  highThreshold: number, // number separating green and yellow zone
}