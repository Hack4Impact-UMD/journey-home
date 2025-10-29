import { db } from "../firebase";
import { collection, doc, getDoc, setDoc, addDoc, Timestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { DonationRequest, DonorInfo, DonationItem } from "../../types/donations";

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
    console.log(`Added new donor: ${donor.email}`);
  } else {
    console.log(`Donor already exists: ${donor.email}`);
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

  const itemsWithIds: DonationItem[] = request.items.map((donationItem) => ({
    ...donationItem,
    item: {
      ...donationItem.item,
      id: uuidv4(),
      dateAdded: donationItem.item.dateAdded ?? Timestamp.now(),
      donorEmail: request.donor.email,
    },
  }));

  const donationDoc = {
    donor: request.donor,
    firstTimeDonor: request.firstTimeDonor,
    howDidYouHear: request.howDidYouHear,
    canDropOff: request.canDropOff,
    notes: request.notes ?? "",
    date: request.date ?? Timestamp.now(),
    items: itemsWithIds,
  };

  const docRef = await addDoc(collection(db, DONATIONS_COLLECTION), donationDoc);
  console.log(`Donation request created: ${docRef.id}`);
  return docRef.id;
}
