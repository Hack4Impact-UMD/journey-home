import { ClientRequest } from "@/types/client-requests";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const CLIENTREQS_COLLECTION = "client-requests";

export async function getAllClientRequest(): Promise <ClientRequest[]> {
    const snapshot = await getDocs(collection(db, CLIENTREQS_COLLECTION));
    const requests: ClientRequest[] = snapshot.docs.map(docSnap => docSnap.data() as ClientRequest);
    return requests;
}


export async function setClientRequest(clientreq: ClientRequest): Promise <void> {
    const docRef = doc(db, CLIENTREQS_COLLECTION, clientreq.id);
    await setDoc(docRef, clientreq);
}