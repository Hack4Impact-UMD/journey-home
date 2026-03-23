import { CategoryAttributes, InventoryChange, InventoryRecord } from "@/types/inventory";

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


export async function setCategoryAttributes(attrs: CategoryAttributes[]) {
    const categoriesDoc = doc(db, "config", "categories");
    await setDoc(categoriesDoc, {categories: attrs});
}

export async function getCategoryAttributes(): Promise<CategoryAttributes[]> {
    const categoriesDoc = doc(db, "config", "categories");
    const docSnap = await getDoc(categoriesDoc);
    return docSnap?.data()?.["categories"] ?? [];
}

export async function getAllWarehouseInventoryRecords(): Promise<InventoryRecord[]> {
    const querySnapshot = await getDocs(collection(db, WAREHOUSE_COLLECTION));
    const records: InventoryRecord[] = querySnapshot.docs.map(
        (doc) => doc.data() as InventoryRecord
    );

    return records;
}

export async function setInventoryRecord(
    record: InventoryRecord,
    actor?: { userId: string; userEmail: string }
): Promise<boolean> {
    try {
        const docRef = doc(db, WAREHOUSE_COLLECTION, record.id);

        // Determine previous quantity for changelog
        if (actor) {
            const prevSnap = await getDoc(docRef);
            const prevQty = prevSnap.exists() ? (prevSnap.data() as InventoryRecord).quantity : 0;
            const isCreate = !prevSnap.exists();
            const changeAmount = record.quantity - prevQty;

            const change: InventoryChange = {
                id: crypto.randomUUID(),
                itemId: record.id,
                itemName: record.name,
                changeType: isCreate ? "Create" : "Set",
                changeAmount,
                amountBefore: prevQty,
                amountAfter: record.quantity,
                timestamp: Timestamp.now(),
                userId: actor.userId,
                userEmail: actor.userEmail,
            };
            await setWarehouseChange(change);
        }

        await setDoc(docRef, record);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function getInventoryRecord(
    id: string
): Promise<InventoryRecord | null> {
    try {
        const docRef = doc(db, WAREHOUSE_COLLECTION, id);
        const snap = await getDoc(docRef);
        return snap.exists() ? (snap.data() as InventoryRecord) : null;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function deleteInventoryRecord(
    id: string,
    actor?: { userId: string; userEmail: string }
): Promise<boolean> {
    try {
        const docRef = doc(db, WAREHOUSE_COLLECTION, id);

        if (actor) {
            const prevSnap = await getDoc(docRef);
            if (prevSnap.exists()) {
                const record = prevSnap.data() as InventoryRecord;
                const change: InventoryChange = {
                    id: crypto.randomUUID(),
                    itemId: id,
                    itemName: record.name,
                    changeType: "Delete",
                    changeAmount: -record.quantity,
                    amountBefore: record.quantity,
                    amountAfter: 0,
                    timestamp: Timestamp.now(),
                    userId: actor.userId,
                    userEmail: actor.userEmail,
                };
                await setWarehouseChange(change);
            }
        }

        await deleteDoc(docRef);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function uploadImage(file: File): Promise<string> {

    const storageRef = ref(storage, "images/"+crypto.randomUUID()+"-"+file.name);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;

}
