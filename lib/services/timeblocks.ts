import { db } from "../firebase";
import { collection, doc, getDocs, setDoc, deleteDoc} from "firebase/firestore";
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