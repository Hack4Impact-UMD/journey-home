import { db } from "@/lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { ClientRequest } from "@/types/client-requests";

export async function createClientRequest(
    request: ClientRequest
): Promise<void> {
    try {
        const docRef = doc(collection(db, "clientRequests"), request.id);

        await setDoc(docRef, {
            ...request,
            createdAt: new Date(),
        });

    } catch (error) {
        console.error("Error creating client request:", error);
        throw error;
    }
}