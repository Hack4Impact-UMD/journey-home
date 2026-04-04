import { Timestamp } from "firebase/firestore";

export type InventoryChangeType = "Set" | "Add" | "Remove" | "Delete" | "Create";

export type WarehouseChange = {
  id: string,
  itemId: string,
  itemName: string,
  changeType: InventoryChangeType,
  changeAmount: number,
  amountBefore: number,
  amountAfter: number,
  timestamp: Timestamp,
  userId: string,
  userEmail: string,
};
