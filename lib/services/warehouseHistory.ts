import { InventoryChange } from "@/types/inventory";
import { db } from "../firebase";
import {
    collection,
    getDocs,
    query,
    Timestamp,
    where,
} from "firebase/firestore";

export const WAREHOUSE_HISTORY_COLLECTION = "warehouseHistory";

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
    return snapshot.docs.map((d) => d.data() as InventoryChange);
}
