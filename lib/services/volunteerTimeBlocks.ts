import { db } from "../firebase";
import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { PickupOrDelivery, VolunteerTimeBlock } from "../../types/pickupsDeliveries";

export const TIMEBLOCKS_COLLECTION = "volunteerTimeBlocks";

/* time blocks functions*/
export async function getAllTimeBlocks(): Promise<VolunteerTimeBlock[]> {
    const snapshot = await getDocs(collection(db, TIMEBLOCKS_COLLECTION));
    return snapshot.docs.map(doc => doc.data() as VolunteerTimeBlock);
}

export async function getTimeBlock(id: string): Promise<VolunteerTimeBlock | null> {
    const snap = await getDoc(doc(db, TIMEBLOCKS_COLLECTION, id));
    return snap.exists() ? (snap.data() as VolunteerTimeBlock) : null;
}

export async function setTimeBlock(block: VolunteerTimeBlock): Promise<void> {
    await setDoc(doc(db, TIMEBLOCKS_COLLECTION, block.id), block);
}

export async function deleteTimeBlock(id: string): Promise<void> {
    await deleteDoc(doc(db, TIMEBLOCKS_COLLECTION, id));
}

/* Task management */
export async function addTaskToTimeBlock(blockId: string, task: PickupOrDelivery): Promise<void> {
    const ref = doc(db, TIMEBLOCKS_COLLECTION, blockId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("Time block not found");

    const block = snap.data() as VolunteerTimeBlock;
    if ((block.tasks?.length || 0) >= block.maxTasks) throw new Error("Time block is full");

    await updateDoc(ref, { tasks: [...(block.tasks || []), task] });
}

export async function removeTaskFromTimeBlock(blockId: string, taskId: string): Promise<void> {
    const ref = doc(db, TIMEBLOCKS_COLLECTION, blockId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("Time block not found");

    const block = snap.data() as VolunteerTimeBlock;
    const updatedTasks = (block.tasks || []).filter(t => t.id !== taskId);
    await updateDoc(ref, { tasks: updatedTasks });
}

/* Scheduling */
export async function findAvailableBlock(date: Date): Promise<VolunteerTimeBlock | null> {
    const blocks = await getAllTimeBlocks();
    const timestamp = Timestamp.fromDate(date);

    return blocks.find(block => {
        const within = timestamp.toMillis() >= block.start.toMillis() && timestamp.toMillis() <= block.end.toMillis();
        const hasSpace = (block.tasks?.length || 0) < block.maxTasks;
        return within && hasSpace;
    }) || null;
}

export async function schedulePickupOrDelivery(task: PickupOrDelivery, date: Date): Promise<void> {
    const block = await findAvailableBlock(date);
    if (!block) throw new Error("No available volunteer time block for this date/time");

    await addTaskToTimeBlock(block.id, task);

    const collectionName = "donor" in task.request ? "pickups" : "deliveries";
    await setDoc(doc(db, collectionName, task.id), {
        ...task,
        scheduledDate: block.start
    }, { merge: true });
}
