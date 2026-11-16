import { ClientRequest } from "@/types/client-requests";
import { collection, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase";

const CLIENTREQS_COLLECTION = "client-requests";

export async function getAllClientRequest(): Promise <ClientRequest[]> {
    const snapshot = await getDocs(collection(db, CLIENTREQS_COLLECTION));
    const requests: ClientRequest[] = snapshot.docs.map(docSnap => docSnap.data() as ClientRequest);
    return requests;
}

// Case managers may only read their own clients, and Firestore rejects a list
// query unless the filter proves that, so the where clause is required.
export async function getClientRequestsByCaseManager(caseManagerID: string): Promise<ClientRequest[]> {
    const snapshot = await getDocs(
        query(collection(db, CLIENTREQS_COLLECTION), where("caseManagerID", "==", caseManagerID))
    );
    return snapshot.docs.map(docSnap => docSnap.data() as ClientRequest);
}

export async function setClientRequest(clientreq: ClientRequest): Promise <void> {
    const docRef = doc(db, CLIENTREQS_COLLECTION, clientreq.id);
    await setDoc(docRef, clientreq);
}

export async function clearClientRequestTimeBlockRef(id: string): Promise<void> {
    const docRef = doc(db, CLIENTREQS_COLLECTION, id);
    await updateDoc(docRef, { associatedTimeBlockID: null });
}

