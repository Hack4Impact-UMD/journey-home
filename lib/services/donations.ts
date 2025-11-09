import { db } from "../firebase";
import { collection, doc, getDoc, setDoc, addDoc, Timestamp } from "firebase/firestore";
import { DonationRequest, DonorInfo } from "../../types/donations";

const DONATIONS_COLLECTION = "donation-requests";
const DONORS_COLLECTION = "donors";

export async function addDonorIfNotExists(
  donor: DonorInfo & {
    firstTimeDonor: boolean;
    howDidYouHear: string;
    canDropOff: boolean;
    notes?: string;
  }
): Promise<void> {
  const donorRef = doc(db, DONORS_COLLECTION, donor.email);
  const donorSnap = await getDoc(donorRef);

  if (!donorSnap.exists()) {
    await setDoc(donorRef, donor);
  }
}

export async function createDonationRequest(request: DonationRequest): Promise<string> {
  await addDonorIfNotExists({
    ...request.donor,
    firstTimeDonor: request.firstTimeDonor,
    howDidYouHear: request.howDidYouHear,
    canDropOff: request.canDropOff,
    notes: request.notes,
  });

  // Items already have IDs generated in Step3Review
  const donationDoc = {
    id: request.id,
    donor: request.donor,
    firstTimeDonor: request.firstTimeDonor,
    howDidYouHear: request.howDidYouHear,
    canDropOff: request.canDropOff,
    notes: request.notes ?? "",
    date: request.date ?? Timestamp.now(),
    items: request.items,
  };

  const docRef = await addDoc(collection(db, DONATIONS_COLLECTION), donationDoc);
  return docRef.id;
}
