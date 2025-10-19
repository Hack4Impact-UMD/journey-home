import {
    InventoryRecord,
    InventoryRecordData,
    SearchFilters,
    sortType,
} from "@/types/inventory";

import { db } from "../firebase";
import { collection, addDoc, doc, getDoc, setDoc, query as searchQuery, getDocs, QueryConstraint, where, orderBy, deleteDoc, Timestamp } from "firebase/firestore";

const MAX_RESULTS = 25


export async function search(
    query: string,
    filters: SearchFilters,
    page: number = 0,
    sort: sortType,
): Promise<InventoryRecord[]> {
    
    const search: QueryConstraint[] = [];

    if (filters.categories.length > 0) {
        search.push(where("category", "in", filters.categories));
    }

    const stockFilterApplied = filters.minStock || filters.maxStock;

    if (filters.minStock) {
        search.push(where("quantity", ">=", Number(filters.minStock)));
    }
    if (filters.maxStock) {
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
        //makes it so that items made on that date also appear
        const endOfDay = new Date(filters.beforeDate);
        endOfDay.setUTCHours(23, 59, 59, 999);
        search.push(where("dateAdded", "<=",Timestamp.fromDate(endOfDay)));
    }
    


    let q = searchQuery(collection(db, "inventoryRecords"), ...search);

    const snapshot = await getDocs(q);

    let results: InventoryRecord[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            dateAdded:
            data.dateAdded instanceof Timestamp
                ? data.dateAdded.toDate()
                : new Date(data.dateAdded),
        } as InventoryRecord;
    });

    
    if (query) {
        const lowerQuery = query.toLowerCase();
        results = results.filter(item => 
        item.name.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery) ||
        //makes it so that notes with key words also show up in search results
        (item.notes?.toLowerCase() ?? "").includes(lowerQuery));
    }

    // applies sorting only if user selected it
    if (sort.newestOldest !== undefined) {
        results = sortByDate(results, sort.newestOldest);
    } else if (sort.leastGreatest !== undefined) {
        results = sortByQuantity(results, sort.leastGreatest);
    }
    return results;
}

//removing async + promise since it's faster + unneeded
export function sortByDate(
    searchResult: InventoryRecord[],
    earliestToOldest: boolean
):  InventoryRecord[]{
    return [...searchResult].sort((a, b) => {
        const dateA = a.dateAdded.getTime();
        const dateB = b.dateAdded.getTime();

        return earliestToOldest ? dateA - dateB : dateB - dateA;
    });
}

export function sortByQuantity(
    searchResult: InventoryRecord[],
    leastToGreatest: boolean
):  InventoryRecord[] {
    return[...searchResult].sort((a,b) => {
        const itemA = a.quantity;
        const itemB = b.quantity;
        return leastToGreatest ? itemA - itemB : itemB - itemA;

    });
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
