import { db } from "../firebase";
import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { PickupOrDelivery, VolunteerTimeBlock } from "../../types/pickupsDeliveries";

export const TIMEBLOCKS_COLLECTION = "volunteerTimeBlocks";

export async function getAllTimeBlocks(): Promise<VolunteerTimeBlock[]> {
    const snapshot = await getDocs(collection(db, TIMEBLOCKS_COLLECTION));
    return snapshot.docs.map(doc => doc.data() as VolunteerTimeBlock);
}

export async function getTimeBlock(id: string): Promise<VolunteerTimeBlock | null> {
    const snap = await getDoc(doc(db, TIMEBLOCKS_COLLECTION, id));
    return snap.exists() ? (snap.data() as VolunteerTimeBlock) : null;
}

//used for scheduling
export async function addTaskToTimeBlock(blockId: string, task: PickupOrDelivery): Promise<void> {
    const ref = doc(db, TIMEBLOCKS_COLLECTION, blockId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("Time block not found");

    const block = snap.data() as VolunteerTimeBlock;
    if ((block.tasks?.length || 0) >= block.maxTasks) throw new Error("Time block is full");

    await updateDoc(ref, { tasks: [...(block.tasks || []), task] });
}

// used for rescheduling 
export async function removeTaskFromTimeBlock(blockId: string, taskId: string): Promise<void> {
    const ref = doc(db, TIMEBLOCKS_COLLECTION, blockId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("Time block not found");

    const block = snap.data() as VolunteerTimeBlock;
    const updatedTasks = (block.tasks || []).filter(t => t.id !== taskId);
    await updateDoc(ref, { tasks: updatedTasks });
}

// scheduling
export async function scheduleTask(
    blockId: string,
    task: PickupOrDelivery,
    previousBlockId?: string
): Promise<void> {
    if (previousBlockId) {
        await removeTaskFromTimeBlock(previousBlockId, task.id);
    }
    await addTaskToTimeBlock(blockId, task);
}
