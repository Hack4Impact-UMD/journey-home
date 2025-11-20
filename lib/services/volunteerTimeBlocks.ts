import { db } from "../firebase";
import { collection, doc, getDocs, getDoc, updateDoc, Timestamp } from "firebase/firestore";
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

export async function addTaskToTimeBlock(
    blockId: string,
    task: PickupOrDelivery
): Promise<VolunteerTimeBlock> {
    const ref = doc(db, TIMEBLOCKS_COLLECTION, blockId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("Time block not found");

    const block = snap.data() as VolunteerTimeBlock;
    if ((block.tasks?.length || 0) >= block.maxTasks) throw new Error("Time block is full");

    const updatedTasks = [...(block.tasks || []), task];
    await updateDoc(ref, { tasks: updatedTasks });

    return { ...block, tasks: updatedTasks };
}

export async function removeTaskFromTimeBlock(
    blockId: string,
    taskId: string
): Promise<VolunteerTimeBlock> {
    const ref = doc(db, TIMEBLOCKS_COLLECTION, blockId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("Time block not found");

    const block = snap.data() as VolunteerTimeBlock;
    const updatedTasks = (block.tasks || []).filter(t => t.id !== taskId);
    await updateDoc(ref, { tasks: updatedTasks });

    return { ...block, tasks: updatedTasks };
}

export async function scheduleTask(
    blockId: string,
    task: PickupOrDelivery,
    previousBlockId?: string
): Promise<VolunteerTimeBlock> {
    if (previousBlockId) {
        await removeTaskFromTimeBlock(previousBlockId, task.id);
    }
    const updatedBlock = await addTaskToTimeBlock(blockId, task);
    return updatedBlock;
}
