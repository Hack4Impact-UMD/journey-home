import { db } from "../firebase";
import { collection, doc, getDocs, setDoc, deleteDoc} from "firebase/firestore";
import { TimeBlock } from "../../types/schedule";
import { Timestamp } from "firebase/firestore";

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

export const createTB = async (startTime: string, endTime: string, maxVolunteers: number): Promise<void> => {
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);

    const start = new Date(); start.setHours(startH, startM, 0);
    const end = new Date(); end.setHours(endH, endM, 0);

    const newBlock: TimeBlock = {
        id: crypto.randomUUID(),
        startTime: Timestamp.fromDate(start),
        endTime: Timestamp.fromDate(end),
        maxVolunteers,
        volunteerIDs: [],
        tasks: [],
        published: false,
    };

    await setTB(newBlock);
};