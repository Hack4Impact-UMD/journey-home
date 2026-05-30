import { db, storage } from "../firebase";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

type FormDoc = { file: string; storagePath: string; uploadedAt: Timestamp; content?: string };

const formDocRef = doc(db, "donationForm", "current");

export async function fetchDonationForm(): Promise<FormDoc | null> {
    const snap = await getDoc(formDocRef);
    return snap.exists() ? (snap.data() as FormDoc) : null;
}

export async function uploadDonationForm(file: File): Promise<void> {
    const existing = await fetchDonationForm();

    const ext = file.name.split(".").pop();
    const storagePath = `donationForm/current.${ext}`;
    const storageRef = ref(storage, storagePath);

    const uploadSnap = await uploadBytes(storageRef, file);
    const fileUrl = await getDownloadURL(uploadSnap.ref);

    await setDoc(formDocRef, {
        file: fileUrl,
        storagePath,
        uploadedAt: Timestamp.now(),
    }, { merge: true });

    if (existing && existing.storagePath !== storagePath) {
        try {
            await deleteObject(ref(storage, existing.storagePath));
        } catch (e: unknown) {
            if ((e as { code?: string }).code !== "storage/object-not-found") throw e;
        }
    }
}

export async function saveDonationFormContent(content: string): Promise<void> {
    await setDoc(formDocRef, { content }, { merge: true });
}

