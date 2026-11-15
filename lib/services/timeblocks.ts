import { db } from "../firebase";
import { collection, doc, getDocs, query, runTransaction, Transaction, where, writeBatch } from "firebase/firestore";
import { PublicTimeBlock, TimeBlock, VolunteerGroup, VolunteerTimeBlock, toPublicTimeBlock } from "../../types/schedule";

const TIMEBLOCKS_COLLECTION = "timeblocks";
const TIMEBLOCK_TASKS_COLLECTION = "timeblock-tasks";
const PUBLIC_TIMEBLOCKS_COLLECTION = "timeblocks-public";

const timeCol = collection(db, TIMEBLOCKS_COLLECTION);
const taskCol = collection(db, TIMEBLOCK_TASKS_COLLECTION);
const publicTimeCol = collection(db, PUBLIC_TIMEBLOCKS_COLLECTION);

// A shift is stored as three documents: the volunteer-readable block, its admin-only
// `tasks` (donation and client requests, PII included) and the anonymous projection.
// Security rules reject the block unless the projection lands in the same batch
// with matching values, so always write them together.
export const setTB = async (timeblock: TimeBlock) => {
    const { tasks, ...block } = timeblock;
    const batch = writeBatch(db);
    batch.set(doc(db, TIMEBLOCKS_COLLECTION, timeblock.id), block);
    batch.set(doc(db, TIMEBLOCK_TASKS_COLLECTION, timeblock.id), { id: timeblock.id, tasks });
    batch.set(doc(db, PUBLIC_TIMEBLOCKS_COLLECTION, timeblock.id), toPublicTimeBlock(block));
    await batch.commit();
};

// Admin-only: rejoins each block with its tasks.
export const fetchAllTB = async (): Promise<TimeBlock[]> => {
    const [blocks, tasks] = await Promise.all([getDocs(timeCol), getDocs(taskCol)]);
    const tasksById = new Map(tasks.docs.map((d) => [d.id, (d.data().tasks ?? []) as TimeBlock["tasks"]]));
    return blocks.docs.map((d) => ({ ...(d.data() as VolunteerTimeBlock), tasks: tasksById.get(d.id) ?? [] }));
};

// Non-admins may only read published blocks, and Firestore rejects a list query
// unless the filter proves that.
export const fetchVolunteerTB = async (): Promise<VolunteerTimeBlock[]> => {
    const snapshot = await getDocs(query(timeCol, where("published", "==", true)));
    return snapshot.docs.map((d) => d.data() as VolunteerTimeBlock);
};

export const fetchPublicTB = async (): Promise<PublicTimeBlock[]> => {
    const snapshot = await getDocs(query(publicTimeCol, where("published", "==", true)));
    return snapshot.docs.map((d) => d.data() as PublicTimeBlock);
};

export const deleteTB = async (id: string) => {
    const batch = writeBatch(db);
    batch.delete(doc(db, TIMEBLOCKS_COLLECTION, id));
    batch.delete(doc(db, TIMEBLOCK_TASKS_COLLECTION, id));
    batch.delete(doc(db, PUBLIC_TIMEBLOCKS_COLLECTION, id));
    await batch.commit();
};

// Volunteers write the shift and its public projection in one transaction. Security
// rules only accept a roster change that adds or removes the caller's own id, in a
// single group and never above maxNum (see ownRosterChangeOnly in firestore.rules),
// so these checks are there for the messages: the Errors thrown here are shown to the
// volunteer as written.
const writeRoster = (
    transaction: Transaction,
    tb: VolunteerTimeBlock,
    volunteerGroups: VolunteerGroup[]
) => {
    transaction.update(doc(db, TIMEBLOCKS_COLLECTION, tb.id), { volunteerGroups });
    transaction.set(
        doc(db, PUBLIC_TIMEBLOCKS_COLLECTION, tb.id),
        toPublicTimeBlock({ ...tb, volunteerGroups })
    );
};

export const signUpForShift = async (timeblockId: string, groupName: string, userId: string): Promise<void> => {
    await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(doc(db, TIMEBLOCKS_COLLECTION, timeblockId));
        if (!snap.exists()) throw new Error("This shift no longer exists.");

        const tb = snap.data() as VolunteerTimeBlock;
        if (!tb.published) throw new Error("This shift isn't open for sign-up.");
        if (tb.endTime.toMillis() < Date.now()) throw new Error("This shift has already ended.");

        const current = tb.volunteerGroups.find((g) => g.volunterIDs.includes(userId));
        if (current) {
            if (current.name === groupName) return;
            throw new Error("You're already signed up for this shift.");
        }

        const group = tb.volunteerGroups.find((g) => g.name === groupName);
        if (!group) throw new Error("That volunteer group no longer exists.");
        if (group.volunterIDs.length >= group.maxNum) throw new Error("This group is full.");

        writeRoster(transaction, tb, tb.volunteerGroups.map((g) =>
            g === group ? { ...g, volunterIDs: [...g.volunterIDs, userId] } : g
        ));
    });
};

export const dropShift = async (timeblockId: string, userId: string): Promise<void> => {
    await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(doc(db, TIMEBLOCKS_COLLECTION, timeblockId));
        if (!snap.exists()) throw new Error("This shift no longer exists.");

        const tb = snap.data() as VolunteerTimeBlock;
        if (!tb.volunteerGroups.some((g) => g.volunterIDs.includes(userId))) return;

        writeRoster(transaction, tb, tb.volunteerGroups.map((g) => ({
            ...g,
            volunterIDs: g.volunterIDs.filter((id) => id !== userId),
        })));
    });
};
