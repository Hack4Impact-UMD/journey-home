import { CategoryAttributes, InventoryRecord } from "@/types/inventory";

import { db, storage } from "../firebase";
import {
    collection,
    doc,
    getDoc,
    setDoc,
    getDocs,
    deleteDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

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
    record: InventoryRecord
): Promise<boolean> {
    try {
        const docRef = doc(db, WAREHOUSE_COLLECTION, record.id);
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
        return (await getDoc(docRef)).data() as InventoryRecord;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function deleteInventoryRecord(id: string): Promise<boolean> {
    try {
        const docRef = doc(db, WAREHOUSE_COLLECTION, id);
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
