import {
    InventoryRecord,
    InventoryRecordData,
    SearchParams,
} from "@/types/inventory";

import { db } from "../firebase";
import { collection, addDoc, doc, getDoc, setDoc, getDocs, deleteDoc } from "firebase/firestore";

export const WAREHOUSE_COLLECTION = "warehouse";

export async function search(
    query: string,
    params: SearchParams
): Promise<InventoryRecord[]> {
    
    const querySnapshot = await getDocs(collection(db, WAREHOUSE_COLLECTION));
    const records: InventoryRecord[] = querySnapshot.docs.map(doc => (
        {
            id: doc.id,
            ...doc.data()
        } as InventoryRecord
    ));

    return records.filter(record => {

        if (params.categories.length != 0 && !params.categories.includes(record.category)) {
            return false;
        }

        if (params.sizes.length != 0 && !params.sizes.includes(record.size)) {
            return false;
        }

        const keywords = `${record.name} ${record.category} ${record.notes} ${record.size}`.toLowerCase();
        query = query.toLowerCase().trim();

        return keywords.includes(query);

    }).sort((rec1, rec2) => {

        let diff;
        if(params.sortBy == "Date") {
            diff = rec1.dateAdded.seconds - rec2.dateAdded.seconds;
        } else if(params.sortBy == "Quantity") {
            diff = rec1.quantity - rec2.quantity;
        } else {
            diff = rec1.name.localeCompare(rec2.name);
        }

        if (!params.ascending) {
            diff *= -1;
        }

        return diff
    });
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
