import { InventoryChange } from "@/types/inventory";
import { db } from "../firebase";
import {
    collection,
    doc,
    getDocs,
    query,
    setDoc,
    Timestamp,
    where,
} from "firebase/firestore";

export const WAREHOUSE_HISTORY_COLLECTION = "warehouseHistory";

/**
 * Get all warehouse change entries, optionally filtered by date range.
 */
export async function getWarehouseHistory(
    startDate?: Date,
    endDate?: Date
): Promise<InventoryChange[]> {
    const col = collection(db, WAREHOUSE_HISTORY_COLLECTION);

    let q;
    if (startDate && endDate) {
        q = query(
            col,
            where("timestamp", ">=", Timestamp.fromDate(startDate)),
            where("timestamp", "<=", Timestamp.fromDate(endDate))
        );
    } else if (startDate) {
        q = query(col, where("timestamp", ">=", Timestamp.fromDate(startDate)));
    } else if (endDate) {
        q = query(col, where("timestamp", "<=", Timestamp.fromDate(endDate)));
    } else {
        q = query(col);
    }

    const snapshot = await getDocs(q);
    return snapshot.docs
        .map((d) => {
            const data = d.data();
            if (!data.id || !data.itemId || !data.timestamp) return null;
            return data as InventoryChange;
        })
        .filter((entry): entry is InventoryChange => entry !== null);
}

/**
 * Write or update a single warehouse change entry.
 */
export async function setWarehouseChange(change: InventoryChange): Promise<void> {
    const docRef = doc(db, WAREHOUSE_HISTORY_COLLECTION, change.id);
    await setDoc(docRef, change);
}
