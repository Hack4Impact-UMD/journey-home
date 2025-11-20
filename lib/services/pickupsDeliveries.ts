import { db } from "../firebase";
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { Pickup, Delivery, PickupOrDelivery } from "../../types/pickupsDeliveries";

export const PICKUPS_COLLECTION = "pickups";
export const DELIVERIES_COLLECTION = "deliveries";

/* Pickups */
export async function getAllPickups(): Promise<Pickup[]> {
    const snapshot = await getDocs(collection(db, PICKUPS_COLLECTION));
    return snapshot.docs.map(doc => doc.data() as Pickup);
}

export async function setPickup(pickup: Pickup): Promise<void> {
    await setDoc(doc(db, PICKUPS_COLLECTION, pickup.id), pickup);
}

export async function deletePickup(id: string): Promise<void> {
    await deleteDoc(doc(db, PICKUPS_COLLECTION, id));
}

/* Deliveries */
export async function getAllDeliveries(): Promise<Delivery[]> {
    const snapshot = await getDocs(collection(db, DELIVERIES_COLLECTION));
    return snapshot.docs.map(doc => doc.data() as Delivery);
}

export async function setDelivery(delivery: Delivery): Promise<void> {
    await setDoc(doc(db, DELIVERIES_COLLECTION, delivery.id), delivery);
}

export async function deleteDelivery(id: string): Promise<void> {
    await deleteDoc(doc(db, DELIVERIES_COLLECTION, id));
}

/* All pickups & deliveries */
export async function getAllPickupsAndDeliveries(): Promise<PickupOrDelivery[]> {
    const [pickups, deliveries] = await Promise.all([getAllPickups(), getAllDeliveries()]);
    return [...pickups, ...deliveries];
}

export async function getPickupOrDelivery(id: string): Promise<PickupOrDelivery | null> {
    const pickupSnap = await getDoc(doc(db, PICKUPS_COLLECTION, id));
    if (pickupSnap.exists()) return pickupSnap.data() as Pickup;

    const deliverySnap = await getDoc(doc(db, DELIVERIES_COLLECTION, id));
    if (deliverySnap.exists()) return deliverySnap.data() as Delivery;

    return null;
}