import {
    InventoryRecord,
    SearchParams,
} from "@/types/inventory";

import { db } from "../firebase";
import { collection, doc, getDoc, setDoc, getDocs, deleteDoc } from "firebase/firestore";

export const WAREHOUSE_COLLECTION = "warehouse";

export async function search(
    query: string,
    params: SearchParams
): Promise<InventoryRecord[]> {
    
    const querySnapshot = await getDocs(collection(db, WAREHOUSE_COLLECTION));
    const records: InventoryRecord[] = querySnapshot.docs.map(doc => (
        doc.data()as InventoryRecord
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

export async function setInventoryRecord(
    record: InventoryRecord
): Promise<void> {
    const docRef = doc(db, WAREHOUSE_COLLECTION, record.id);
    await setDoc(docRef, record);
}


export async function getInventoryRecord(id: string): Promise<InventoryRecord | null> {
    const docRef = doc(db, WAREHOUSE_COLLECTION, id);
    return (await getDoc(docRef)).data() as InventoryRecord;
};


export async function deleteInventoryRecord(id: string): Promise<void> {
    const docRef = doc(db, WAREHOUSE_COLLECTION, id);
    await deleteDoc(docRef)
}
