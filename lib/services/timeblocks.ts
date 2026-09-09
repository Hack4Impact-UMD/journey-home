import { db } from "../firebase";
import { collection, doc, getDocs, query, runTransaction, where, writeBatch } from "firebase/firestore";
import { PublicTimeBlock, TimeBlock, toPublicTimeBlock } from "../../types/schedule";

const TIMEBLOCKS_COLLECTION = "timeblocks";
const PUBLIC_TIMEBLOCKS_COLLECTION = "timeblocks-public";

const timeCol = collection(db, TIMEBLOCKS_COLLECTION);
const publicTimeCol = collection(db, PUBLIC_TIMEBLOCKS_COLLECTION);

// A time block and its public projection must always be written together:
// security rules reject either document unless the other lands in the same batch
// or transaction with matching values.
export const setTB = async (timeblock: TimeBlock) => {
    const batch = writeBatch(db);
    batch.set(doc(db, TIMEBLOCKS_COLLECTION, timeblock.id), timeblock);
    batch.set(doc(db, PUBLIC_TIMEBLOCKS_COLLECTION, timeblock.id), toPublicTimeBlock(timeblock));
    await batch.commit();
};

// Only admins may read unpublished shifts, and Firestore rejects a list query
// unless the filter proves that, so non-admins must pass publishedOnly.
export const fetchAllTB = async (publishedOnly: boolean): Promise<TimeBlock[]> => {
    const snapshot = await getDocs(
        publishedOnly ? query(timeCol, where("published", "==", true)) : query(timeCol)
    );
    return snapshot.docs.map((d) => d.data() as TimeBlock);
};

export const fetchPublicTB = async (): Promise<PublicTimeBlock[]> => {
    const snapshot = await getDocs(query(publicTimeCol, where("published", "==", true)));
    return snapshot.docs.map((d) => d.data() as PublicTimeBlock);
};

export const deleteTB = async (id: string) => {
    const batch = writeBatch(db);
    batch.delete(doc(db, TIMEBLOCKS_COLLECTION, id));
    batch.delete(doc(db, PUBLIC_TIMEBLOCKS_COLLECTION, id));
    await batch.commit();
};

// sign up a volunteer for a shift group atomically — throws if the group is full
export const signUpForShift = async (tbId: string, groupName: string, userId: string): Promise<TimeBlock> => {
    const timeRef = doc(db, TIMEBLOCKS_COLLECTION, tbId);

    return runTransaction(db, async (transaction) => {
        const snap = await transaction.get(timeRef);
        if (!snap.exists()) throw new Error("Shift not found");

        const tb = snap.data() as TimeBlock;
        const group = tb.volunteerGroups.find((g) => g.name === groupName);

        if (!group) throw new Error("Volunteer group not found");
        if (group.volunterIDs.includes(userId)) return tb;
        if (group.volunterIDs.length >= group.maxNum) throw new Error("This group is full");

        const updatedGroups = tb.volunteerGroups.map((g) =>
            g.name === groupName ? { ...g, volunterIDs: [...g.volunterIDs, userId] } : g
        );
        const updatedTB = { ...tb, volunteerGroups: updatedGroups };

        transaction.set(timeRef, updatedTB);
        transaction.set(doc(db, PUBLIC_TIMEBLOCKS_COLLECTION, tbId), toPublicTimeBlock(updatedTB));
        return updatedTB;
    });
};
