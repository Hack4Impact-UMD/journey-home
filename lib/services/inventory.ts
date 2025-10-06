import {
    InventoryRecord,
    InventoryRecordData,
    SearchFilters,
} from "@/types/inventory";

import { db } from "../firebase";
import { collection, addDoc, doc, getDoc, query as searchQuery, getDocs, QueryConstraint, where, orderBy, deleteDoc } from "firebase/firestore";

const MAX_RESULTS = 25


export async function search(
    query: string,
    filters: SearchFilters,
    page: number = 0
): Promise<InventoryRecord[]> {
    
    const search: QueryConstraint[] = [];

    if (filters.categories.length === 1) {
    search.push(where("category", "==", filters.categories[0]));
    } else if (filters.categories.length > 1) {
        search.push(where("category", "in", filters.categories));
    }

    const stockFilterApplied = filters.minStock !== undefined || filters.maxStock !== undefined;

    if (filters.minStock !== undefined) {
        search.push(where("quantity", ">=", Number(filters.minStock)));
    }
    if (filters.maxStock !== undefined) {
        search.push(where("quantity", "<=", Number(filters.maxStock)));
    }

    if (stockFilterApplied) {
        search.push(orderBy("quantity"));
        search.push(orderBy("name"));
    } else {
        search.push(orderBy("name"));
    }

    if (filters.afterDate) {
        search.push(where("dateAdded", ">=", filters.afterDate));
    }

    if (filters.beforeDate) {
        search.push(where("dateAdded", "<=", filters.beforeDate));
    }


    const q = searchQuery(collection(db, "inventoryRecords"), ...search);

    const snapshot = await getDocs(q);

    let results = snapshot.docs.map(doc => {
    const data = doc.data() as InventoryRecordData & { dateAdded: any };
    return {
        id: doc.id,
        ...data,
        dateAdded: data.dateAdded.toDate ? data.dateAdded.toDate() : data.dateAdded
        } as InventoryRecord;
    });
 
    if (query) {
        const lowerQuery = query.toLowerCase();
        results = results.filter(item =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery) ||
        item.notes.toLowerCase().includes(lowerQuery)
        );
    }

    return results;
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
    try{
        await deleteDoc(doc(db, "inventoryRecords", id));
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}
