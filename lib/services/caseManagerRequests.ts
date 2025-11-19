import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase"; 

export type RequestedItem = {
  name: string;
  quantity: number;
  notes?: string;
};

export type CaseManagerRequestInput = {
  caseManagerName: string;
  caseManagerEmail: string;
  caseManagerPhone?: string;
  programName: string;

  clientFirstName: string;
  clientLastName: string;
  clientPhone?: string;
  clientEmail?: string;
  householdSize?: string;
  referralReason?: string;

  items: RequestedItem[];
  additionalNotes?: string;
};

export async function createCaseManagerRequest(
  data: CaseManagerRequestInput,
  caseManagerUid?: string 
) {
  const payload = {
    ...data,
    caseManagerUid: caseManagerUid ?? null,
    createdAt: serverTimestamp(),
    status: "new",
  };

  await addDoc(collection(db, "caseManagerRequests"), payload);
}
