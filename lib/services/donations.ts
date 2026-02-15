import {
    DonationItem,
    DonationRequest,
} from "@/types/donations";

import { db } from "../firebase";
import { collection, doc, getDoc, setDoc, getDocs, deleteDoc, Timestamp } from "firebase/firestore";
import { LocationContact, ReviewStatus } from "@/types/general";

const DONATIONS_COLLECTION = "donation-requests";
const DONORS_COLLECTION = "donors";

export async function setDonationRequest(
    record: DonationRequest
): Promise<void> {
    const docRef = doc(db, DONATIONS_COLLECTION, record.id);
    await setDoc(docRef, record);
}

export async function getDonationRequest(id: string): Promise<DonationRequest | null> {
    const docRef = doc(db, DONATIONS_COLLECTION, id);
    const document = await getDoc(docRef);

    if (!document.exists()) {
        return null;
    }

    return (document.data() as DonationRequest);

};


export async function deleteDonationRequest(id: string): Promise<boolean> {
    const docRef = doc(db, DONATIONS_COLLECTION, id);
    const document = await getDoc(docRef);

    if(!document.exists()) {
        return false;
    }

    await deleteDoc(docRef);
    return true;
}

export async function setRequestItemStatus(requestId: string, itemId: string, status: ReviewStatus): Promise<boolean> {
    //get the record we're working with
    const request = await getDonationRequest(requestId);
    if (!request) {
        return false;
    }

    //update the accept for the specific item -> get the id of the inventory record when calling this func?
    //to actually access the specific item -> iterate through the items and see for which one the id matches? 
    const updatedItems = request.items.map(itemy => itemy.item.id === itemId
        ? {...itemy, status: status} as DonationItem
        : itemy );

    //update this item in the request itself
    await setDonationRequest({
        ...request,
        items: updatedItems,
        id: requestId

    });

    return true;

}

//do search based on name
//sort filters based on what's there for inventory records already.

export async function getAllDonationRequests(): Promise<DonationRequest[]> {
    
    const querySnapshot = await getDocs(collection(db, DONATIONS_COLLECTION));
    const requests: DonationRequest[] = querySnapshot.docs.map(doc => (
        doc.data() as DonationRequest
    ));

    return requests;
}

/* 
 to do: 
    - typical backend functions for the donation requests ig
        - 
    - search function to find the item within the database? 
    - accept/reject functionality? i guess just based on if input is approve or deny for each donation item? 
        donationitem.status basically within the donation request which has person info and then the items too
*/


export async function addDonorIfNotExists(
  donor: LocationContact & {
    firstTimeDonor: boolean;
    howDidYouHear: string;
    canDropOff: boolean;
    notes?: string;
  }
): Promise<void> {
  const donorRef = doc(db, DONORS_COLLECTION, donor.email);
  await setDoc(donorRef, donor);
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

  await setDoc(doc(db, DONATIONS_COLLECTION, request.id), donationDoc);
  return request.id;
}

export const fetchAllDonors = async (): Promise<LocationContact[]> => {
  const snapshot = await getDocs(collection(db, DONORS_COLLECTION));
  const donors: LocationContact[] = [];
  snapshot.forEach((doc) => {
    donors.push(doc.data() as LocationContact);
  });
  return donors;
};

export async function getDonor(email: string): Promise<LocationContact | null> {
  const donorRef = doc(db, DONORS_COLLECTION, email);
  const donorSnap = await getDoc(donorRef);

  if (donorSnap.exists()) {
    return donorSnap.data() as LocationContact;
  } else {
    return null;
  }
}