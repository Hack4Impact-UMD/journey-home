import {
    InventoryRecord,
    InventoryRecordData,
    SearchFilters,
    SortBy,
} from "@/types/inventory";

import { db } from "../firebase";
import { collection, addDoc, doc, getDoc, setDoc, query as searchQuery, getDocs, QueryConstraint, where, orderBy, deleteDoc, Timestamp } from "firebase/firestore";

const WAREHOUSE_COLLECTION = "warehouse";

export async function search(
    query: string,
    filters: SearchFilters,
    sort: SortBy,
): Promise<InventoryRecord[]> {
    
    
    return [];
}

export async function createInventoryRecord(
    recordData: InventoryRecordData
): Promise<string> {
    const docRef = await addDoc(collection(db, WAREHOUSE_COLLECTION), recordData);
    return docRef.id;
}


export async function getInventoryRecord(id: string): Promise<InventoryRecord | null> {
    const docRef = doc(db, WAREHOUSE_COLLECTION, id);
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
        await setDoc(doc(db, WAREHOUSE_COLLECTION, record.id), record as InventoryRecordData);
        return true;
    } catch (error){
        console.error(error);
        return false;
    }

}

export async function deleteInventoryRecord(id: string): Promise<boolean> {
    try{
        await deleteDoc(doc(db, WAREHOUSE_COLLECTION, id));
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}
