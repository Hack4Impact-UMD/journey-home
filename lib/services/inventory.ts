import { InventoryRecord } from "@/types/inventory";

import { db, storage } from "../firebase";
import {
    collection,
    doc,
    getDoc,
    setDoc,
    getDocs,
    deleteDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const WAREHOUSE_COLLECTION = "warehouse";

export function useCategories(): string[] {

    const [allCategories, setAllCategories] = useState<string[]>(["Other",]);

    useEffect(() => {
        getCategories().then(categories => setAllCategories(categories));
      }, []);

    return allCategories;

}

export async function getCategories(): Promise<string[]> {
    const categoriesDoc = doc(db, "config", "categories");
    const categoriesSnapshot = await getDoc(categoriesDoc);
    if (!categoriesSnapshot.exists()) {
        return ["Other"];
    }
    return categoriesSnapshot.data().categories || ["Other"];
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
