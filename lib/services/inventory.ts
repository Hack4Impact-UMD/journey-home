import {
    InventoryRecord,
    InventoryRecordData,
    SearchFilters,
} from "@/types/inventory";

import { db } from "../firebase";
import { collection, addDoc, doc, getDoc, deleteDoc, setDoc } from "firebase/firestore";

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
    try{
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
    } catch(error) {
        console.error(error);
        throw new Error();
    }
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
    try{
        await setDoc(doc(db, "inventoryRecords", record.id), {
            name: record.name,
            thumbnail: record.thumbnail,
            otherPhotos: record.otherPhotos,
            category: record.category,
            notes: record.notes,
            quantity: record.quantity,
            dateAdded: record.dateAdded,
        });
        return true;
    } catch (error){
        console.error(error);
        return false;
    }

}

export async function deleteInventoryRecord(id: string): Promise<boolean> {
    try{
        await deleteDoc(doc(db, "inventoryRecords", id));
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}
