import { InventoryCategory } from "@/types/inventory";

import { db, storage } from "../firebase";
import {
    collection,
    doc,
    setDoc,
    getDocs,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const WAREHOUSE_COLLECTION = "warehouse";

export async function getAllInventoryCategories(): Promise<InventoryCategory[]> {
    const querySnapshot = await getDocs(collection(db, WAREHOUSE_COLLECTION));
    return querySnapshot.docs.map((doc) => doc.data() as InventoryCategory);
}

export async function setInventoryCategory(category: InventoryCategory): Promise<void> {
    await setDoc(doc(db, WAREHOUSE_COLLECTION, category.id), category);
}

export async function uploadImage(file: File): Promise<string> {
    const storageRef = ref(storage, "images/"+crypto.randomUUID()+"-"+file.name);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
}
