import { db, storage } from "../firebase";
import { collection, doc, getDoc, getDocs, runTransaction, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Waiver } from "@/types/user";

const waiversCol = collection(db, "waivers");
const metaRef = doc(db, "waivers", "_meta");

type WaiverMeta = { nextId: number; activeId: string | null };

export async function fetchAllWaivers(): Promise<Waiver[]> {
    const snapshot = await getDocs(waiversCol);
    return snapshot.docs
        .filter((d) => d.id !== "_meta")
        .map((d) => d.data() as Waiver);
}

export async function addWaiver(file: File): Promise<void> {
    const metaSnap = await getDoc(metaRef);
    const meta: WaiverMeta = metaSnap.exists()
        ? (metaSnap.data() as WaiverMeta)
        : { nextId: 1, activeId: null };

    const id = String(meta.nextId);

    // Upload happens outside the transaction — if the transaction later fails, the file
    // is orphaned in storage but no Firestore doc will reference it.
    const storageRef = ref(storage, "waivers/" + id + "-" + file.name);
    const uploadSnap = await uploadBytes(storageRef, file);
    const fileUrl = await getDownloadURL(uploadSnap.ref);

    const start = Timestamp.now();
    const newWaiver: Waiver = { id, file: fileUrl, start, end: null };
    const newDocRef = doc(db, "waivers", id);

    await runTransaction(db, async (t) => {
        // Re-read meta inside the transaction to catch concurrent uploads
        const freshMeta = await t.get(metaRef);
        const currentNextId = freshMeta.exists() ? (freshMeta.data() as WaiverMeta).nextId : 1;
        if (currentNextId !== meta.nextId) {
            throw new Error("A waiver was uploaded concurrently. Please try again.");
        }

        t.set(newDocRef, newWaiver);

        if (meta.activeId) {
            t.update(doc(db, "waivers", meta.activeId), { end: start });
        }

        t.set(metaRef, { nextId: meta.nextId + 1, activeId: id } satisfies WaiverMeta);
    });
}
