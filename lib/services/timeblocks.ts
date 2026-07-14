import { db } from "../firebase";
import { collection, doc, getDocs, setDoc, deleteDoc, runTransaction, writeBatch } from "firebase/firestore";
import { TimeBlock } from "../../types/schedule";

const timeCol = collection(db, "timeblocks");

//set time block (edit + create)
export const setTB = async(timeblock: TimeBlock) => {
    const timeRef = doc(db, "timeblocks", timeblock.id);
  await setDoc(timeRef, timeblock);
}

export const setTBBulk = async (tbs: TimeBlock[]) => {
  const chunks: TimeBlock[][] = []
  for(let i = 0; i < tbs.length; i += 450) {
    chunks.push(tbs.slice(i, i + 450))
  }

  return Promise.all(chunks.map(async (chunk) => {
    const batch = writeBatch(db);
    chunk.forEach((tb) => {
      batch.set(doc(db, "timeblocks", tb.id), tb)
    })
    await batch.commit()
  }))
}

//fetch all time blocks
export const fetchAllTB = async (): Promise<TimeBlock[]> => {
  const snapshot = await getDocs(timeCol);
  const TBs: TimeBlock[] = [];

  snapshot.forEach((doc) => {
    TBs.push({ seriesId: doc.id, recurrence: null, ...doc.data() } as TimeBlock);
  });
  return TBs;
};

//delete time blocks
export const deleteTB = async (id: string) => {
  const timeRef = doc(db, "timeblocks", id);
  await deleteDoc(timeRef);
};

export const deleteTBBulk = async (tbs: TimeBlock[]) => {
  // chunk by total batch operations (1 delete + 1 ref-clear per task), not just timeblock count,
  // since each timeblock can bring along a variable number of task ref-clears into the same batch
  const chunks: TimeBlock[][] = []
  let current: TimeBlock[] = []
  let opCount = 0

  for (const tb of tbs) {
    const tbOps = 1 + tb.tasks.length;
    if (current.length > 0 && opCount + tbOps > 450) {
      chunks.push(current)
      current = []
      opCount = 0
    }
    current.push(tb)
    opCount += tbOps
  }
  if (current.length > 0) chunks.push(current)

  return Promise.all(chunks.map(async (chunk) => {
    const batch = writeBatch(db);
    chunk.forEach((tb) => {
      batch.delete(doc(db, "timeblocks", tb.id))
      tb.tasks.forEach((task) => {
        const collectionName = "donor" in task ? "donation-requests" : "client-requests";
        batch.update(doc(db, collectionName, task.id), { associatedTimeBlockID: null })
      })
    })
    await batch.commit()
  }))
}

// sign up a volunteer for a shift group atomically — throws if the group is full
export const signUpForShift = async (tbId: string, groupName: string, userId: string): Promise<TimeBlock> => {
  const timeRef = doc(db, "timeblocks", tbId);

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
    return updatedTB;
  });
};