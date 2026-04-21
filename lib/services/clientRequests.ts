import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ClientRequest } from "@/types/client-requests";

export async function createClientRequest(
    request: ClientRequest
): Promise<void> {
    try {
        const docRef = doc(db, "clientRequests", request.id);

        await setDoc(docRef, {
            ...request,
            createdAt: serverTimestamp(),
        });

    } catch (error) {
        console.error("Error creating client request:", error);
        throw error;
    }
}