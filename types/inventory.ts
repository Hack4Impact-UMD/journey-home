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

export type InventoryCategory = {
  id: string,
  name: string,
  quantity: number,
  lowThreshold: number,
  highThreshold: number,
}

export type CategoryQuantityChange = {
  category: string,
  oldQuantity: number,
  newQuantity: number,
}

export type InventoryChange = {
  id: string,
  userId: string,
  timestamp: Timestamp,
  change: CategoryQuantityChange,
  reverted: boolean,
}
