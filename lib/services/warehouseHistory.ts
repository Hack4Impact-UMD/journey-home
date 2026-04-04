import { WarehouseChange } from "@/types/changelog";
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

function isWarehouseChange(data: Record<string, unknown>): data is WarehouseChange {
    return (
        typeof data.id === "string" &&
        typeof data.itemId === "string" &&
        typeof data.itemName === "string" &&
        typeof data.changeType === "string" &&
        typeof data.changeAmount === "number" &&
        typeof data.amountBefore === "number" &&
        typeof data.amountAfter === "number" &&
        typeof data.userId === "string" &&
        typeof data.userEmail === "string" &&
        data.timestamp != null
    );
}


export async function getWarehouseHistory(
    startDate?: Date,
    endDate?: Date
): Promise<WarehouseChange[]> {
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
        .map((d) => d.data() as Record<string, unknown>)
        .filter(isWarehouseChange);
}

/**
 * Write or update a single warehouse change entry.
 */
export async function setWarehouseChange(change: WarehouseChange): Promise<void> {
    const docRef = doc(db, WAREHOUSE_HISTORY_COLLECTION, change.id);
    await setDoc(docRef, change);
}
