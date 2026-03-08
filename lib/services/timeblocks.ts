import { db } from "../firebase";
import { collection, doc, getDocs, setDoc, deleteDoc } from "firebase/firestore";
import { TimeBlock } from "../../types/schedule";
import { Timestamp } from "firebase/firestore";

const timeCol = collection(db, "timeblocks");

//set time block (edit + create)
export const setTB = async (timeblock: TimeBlock) => {
    const timeRef = doc(db, "timeblocks", timeblock.id);
    await setDoc(timeRef, timeblock);
};

//fetch all time blocks
export const fetchAllTB = async (): Promise<TimeBlock[]> => {
    const snapshot = await getDocs(timeCol);
    const TBs: TimeBlock[] = [];

    snapshot.forEach((doc) => {
        const data = doc.data();
        TBs.push({
            id: doc.id,
            startTime: data.startTime as Timestamp,
            endTime: data.endTime as Timestamp,
            maxVolunteers: data.maxVolunteers ?? 0,
            volunteerIDs: data.volunteerIDs ?? [],
            tasks: data.tasks ?? [],
            published: data.published ?? false,
        } as TimeBlock);
    });

    return TBs;
};

//delete time blocks
export const deleteTB = async (id: string) => {
    const timeRef = doc(db, "timeblocks", id);
    await deleteDoc(timeRef);
};