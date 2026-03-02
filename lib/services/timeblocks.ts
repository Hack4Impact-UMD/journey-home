import { db } from "../firebase";
import { collection, doc, getDocs, setDoc, deleteDoc} from "firebase/firestore";
import { TimeBlock } from "../../types/schedule";
import { Timestamp } from "firebase/firestore";

const timeCol = collection(db, "volunteerTimeBlocks");

//set time block (edit + create)
export const setTB = async(timeblock: TimeBlock) => {
  const timeRef = doc(db, "volunteerTimeBlocks", timeblock.id);
  await setDoc(timeRef, timeblock);
}

export const fetchAllTB = async (): Promise<TimeBlock[]> => {
  const snapshot = await getDocs(timeCol);
  const TBs: TimeBlock[] = [];

  snapshot.forEach((doc) => {
    const data = doc.data();

    // Handle old field names (startTime/endTime) AND new ones (start/end)
    const rawStart = data.start ?? data.startTime;
    const rawEnd = data.end ?? data.endTime;

    if (!rawStart || !rawEnd) {
      console.warn("Skipping doc missing start/end:", doc.id);
      return;
    }

    TBs.push({
      id: doc.id,                          // use doc.id, not data.id
      start: Timestamp.fromMillis(rawStart.seconds * 1000),
      end: Timestamp.fromMillis(rawEnd.seconds * 1000),
      maxTasks: data.maxTasks ?? data.maxVolunteers ?? 0,
      volunteerIDs: data.volunteerIDs ?? [],
      tasks: data.tasks ?? [],
      published: data.published ?? false,
      type: data.type ?? "Pickups / Deliveries",
    } as TimeBlock);
  });

  return TBs;
};

//delete time blocks
export const deleteTB = async (id: string) => {
  const timeRef = doc(db, "volunteerTimeBlocks", id);
  await deleteDoc(timeRef);
};

export const createTB = async (startTime: string, endTime: string, maxVolunteers: number): Promise<void> => {
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);

    const start = new Date(); start.setHours(startH, startM, 0);
    const end = new Date(); end.setHours(endH, endM, 0);

 const newBlock: TimeBlock = {
    id: crypto.randomUUID(),
    start: Timestamp.fromDate(start),   // was startTime
    end: Timestamp.fromDate(end),       // was endTime
    maxTasks: maxVolunteers,            // was maxVolunteers
    volunteerIDs: [],
    tasks: [],
    published: false,
    type: "Pickups / Deliveries",       // add default type
};

    await setTB(newBlock);
};