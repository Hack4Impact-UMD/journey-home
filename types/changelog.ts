import { Timestamp } from "firebase/firestore";

export type InventoryChangeType = "Addition" | "Removal";

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
