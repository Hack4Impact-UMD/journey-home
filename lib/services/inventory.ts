import {
    InventoryRecord,
    InventoryRecordData,
    SearchFilters,
} from "@/types/inventory";

import { db } from "../firebase";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";

const MAX_RESULTS = 25


export async function search(
    query: string,
    filters: SearchFilters,
    page: number = 0
): Promise<InventoryRecord[]> {
    // TODO: implement
    return [];
}


export async function createInventoryRecord(
    recordData: InventoryRecordData
): Promise<string> {
    const docRef = await addDoc(collection(db, "inventoryRecords"), {
        name: recordData.name,
        thumbnail: recordData.thumbnail,
        otherPhotos: recordData.otherPhotos,
        category: recordData.category,
        notes: recordData.notes,
        quantity: recordData.quantity,
        dateAdded: recordData.dateAdded,
    });
    return docRef.id;
}


export async function getInventoryRecord(id: string): Promise<InventoryRecord | null> {
    const docRef = doc(db, "inventoryRecords", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()){
        return { id: docSnap.id,  ...docSnap.data() as InventoryRecordData }; //clearly define snapshot as that type
    } else {
        return null;
    }
};


export async function updateInventoryRecord(
    record: InventoryRecord
): Promise<boolean> {
    // TODO: implement
    return false;
}

export async function deleteInventoryRecord(id: string): Promise<boolean> {
    // TODO: implement
    return false;
}
