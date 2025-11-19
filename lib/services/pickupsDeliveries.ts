import { db } from "../firebase";
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { Pickup, Delivery, PickupOrDelivery } from "../../types/pickupsdeliveries";

export const PICKUPS_COLLECTION = "pickups";
export const DELIVERIES_COLLECTION = "deliveries";

/* Get all pickups */
export async function getAllPickups(): Promise<Pickup[]> {
    const snapshot = await getDocs(collection(db, PICKUPS_COLLECTION));
    return snapshot.docs.map(doc => doc.data() as Pickup);
}

/*Create / update a pickup */
export async function setPickup(pickup: Pickup): Promise<void> {
    const ref = doc(db, PICKUPS_COLLECTION, pickup.id);
    await setDoc(ref, pickup);
}

/*Delete a pickup */
export async function deletePickup(id: string): Promise<void> {
    const ref = doc(db, PICKUPS_COLLECTION, id);
    await deleteDoc(ref);
}

/*Get all deliveries */
export async function getAllDeliveries(): Promise<Delivery[]> {
    const snapshot = await getDocs(collection(db, DELIVERIES_COLLECTION));
    return snapshot.docs.map(doc => doc.data() as Delivery);
}

/*Create / update a delivery */
export async function setDelivery(delivery: Delivery): Promise<void> {
    const ref = doc(db, DELIVERIES_COLLECTION, delivery.id);
    await setDoc(ref, delivery);
}

/*Delete a delivery */
export async function deleteDelivery(id: string): Promise<void> {
    const ref = doc(db, DELIVERIES_COLLECTION, id);
    await deleteDoc(ref);
}

/*Get all pickups and deliveries together */
export async function getAllPickupsAndDeliveries(): Promise<PickupOrDelivery[]> {
    const [pickups, deliveries] = await Promise.all([getAllPickups(), getAllDeliveries()]);
    return [...pickups, ...deliveries];
}

/*Get a single PickupOrDelivery by ID */
export async function getPickupOrDelivery(id: string): Promise<PickupOrDelivery | null> {
    const pickupRef = doc(db, PICKUPS_COLLECTION, id);
    const deliveryRef = doc(db, DELIVERIES_COLLECTION, id);

    const [pickupSnap, deliverySnap] = await Promise.all([getDoc(pickupRef), getDoc(deliveryRef)]);

    if (pickupSnap.exists()) return pickupSnap.data() as Pickup;
    if (deliverySnap.exists()) return deliverySnap.data() as Delivery;

    return null;
}
