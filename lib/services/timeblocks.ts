import { db } from "../firebase";
import { collection, doc, getDocs, setDoc, deleteDoc, runTransaction } from "firebase/firestore";
import { TimeBlock } from "../../types/schedule";

const timeCol = collection(db, "timeblocks");

//set time block (edit + create)
export const setTB = async(timeblock: TimeBlock) => {
    const timeRef = doc(db, "timeblocks", timeblock.id);
  await setDoc(timeRef, timeblock);
}

//fetch all time blocks
export const fetchAllTB = async (): Promise<TimeBlock[]> => {
  const snapshot = await getDocs(timeCol);
  const TBs: TimeBlock[] = [];

  snapshot.forEach((doc) => {
    TBs.push(doc.data() as TimeBlock);
  });
  return TBs;
};

//delete time blocks
export const deleteTB = async (id: string) => {
  const timeRef = doc(db, "timeblocks", id);
  await deleteDoc(timeRef);
};

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