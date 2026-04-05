import { InventoryCategory, InventoryRecord } from "@/types/inventory";
import { WarehouseChange } from "@/types/changelog";

import { db, storage } from "../firebase";
import {
    collection,
    doc,
    getDoc,
    setDoc,
    getDocs,
    deleteDoc,
    Timestamp,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { setWarehouseChange } from "./warehouseHistory";

export const WAREHOUSE_COLLECTION = "warehouse";

export async function getAllInventoryCategories(): Promise<InventoryCategory[]> {
    const querySnapshot = await getDocs(collection(db, WAREHOUSE_COLLECTION));
    return querySnapshot.docs.map((doc) => doc.data() as InventoryCategory);
}

export async function setInventoryCategory(category: InventoryCategory): Promise<void> {
    await setDoc(doc(db, WAREHOUSE_COLLECTION, category.id), category);
}

export async function uploadImage(file: File): Promise<string> {
    const storageRef = ref(storage, "images/" + crypto.randomUUID() + "-" + file.name);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
}

export async function getInventoryRecord(id: string): Promise<InventoryRecord | null> {
    try {
        const snap = await getDoc(doc(db, WAREHOUSE_COLLECTION, id));
        return snap.exists() ? (snap.data() as InventoryRecord) : null;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function setInventoryRecord(
    record: InventoryRecord,
    actor?: { userId: string; userEmail: string }
): Promise<boolean> {
    try {
        const docRef = doc(db, WAREHOUSE_COLLECTION, record.id);
        const prevSnap = await getDoc(docRef);
        const prevQty = prevSnap.exists() ? (prevSnap.data() as InventoryRecord).quantity : 0;

        await setDoc(docRef, record);

        if (actor) {
            const change: WarehouseChange = {
                id: crypto.randomUUID(),
                itemId: record.id,
                itemName: record.name,
                changeType: record.quantity >= prevQty ? "Addition" : "Removal",
                changeAmount: record.quantity - prevQty,
                amountBefore: prevQty,
                amountAfter: record.quantity,
                timestamp: Timestamp.now(),
                userId: actor.userId,
                userEmail: actor.userEmail,
            };
            try {
                await setWarehouseChange(change);
            } catch {
                // rollback inventory
                if (prevSnap.exists()) {
                    await setDoc(docRef, prevSnap.data());
                } else {
                    await deleteDoc(docRef);
                }
                throw new Error("Failed to write audit log; inventory change rolled back.");
            }
        }
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function deleteInventoryRecord(
    id: string,
    actor?: { userId: string; userEmail: string }
): Promise<boolean> {
    try {
        const docRef = doc(db, WAREHOUSE_COLLECTION, id);
        const prevSnap = await getDoc(docRef);

        await deleteDoc(docRef);

        if (actor && prevSnap.exists()) {
            const record = prevSnap.data() as InventoryRecord;
            const change: WarehouseChange = {
                id: crypto.randomUUID(),
                itemId: id,
                itemName: record.name,
                changeType: "Removal",
                changeAmount: -record.quantity,
                amountBefore: record.quantity,
                amountAfter: 0,
                timestamp: Timestamp.now(),
                userId: actor.userId,
                userEmail: actor.userEmail,
            };
            try {
                await setWarehouseChange(change);
            } catch (auditErr) {
                try {
                    await setDoc(docRef, record);
                    throw new Error("Failed to write audit log; deletion rolled back.");
                } catch {
                    throw new Error(`Audit write failed and rollback also failed: ${auditErr}`);
                }
            }
        }
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}
