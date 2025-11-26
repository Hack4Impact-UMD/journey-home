import {
    DonorInfo,
    DonationItem,
    DonationRequest,
    DonationSearchParams
} from "@/types/donations";

import { db } from "../firebase";
import { collection, doc, getDoc, setDoc, getDocs, deleteDoc, Timestamp, addDoc, getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { InventoryPhoto, InventoryRecord } from "@/types/inventory";

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

export async function acceptRequestItem(requestId: string, itemId: string): Promise<boolean> {
    //get the record we're working with
    const request = await getDonationRequest(requestId);
    if (!request) {
        return false;
    }

    //update the accept for the specific item -> get the id of the inventory record when calling this func?
    //to actually access the specific item -> iterate through the items and see for which one the id matches? 
    const updatedItems = request.items.map(itemy => itemy.item.id === itemId
        ? {...itemy, status: "Approved"} as DonationItem
        : itemy );

    //update this item in the request itself
    await setDonationRequest({
        ...request,
        items: updatedItems,
        id: requestId

    });

    return true;

    //add to the Pickup Dashboard [LATER]
}

export async function denyRequestItem(requestId: string, itemId: string): Promise<boolean> {

    const request = await getDonationRequest(requestId);
    if (!request) {
        return false;
    }

    const updatedItems = request.items.map(itemy => itemy.item.id === itemId
        ? {...itemy, status: "Denied"} as DonationItem
        : itemy );

    await setDonationRequest({
        ...request,
        items: updatedItems,
        id: requestId

    });

    return true;

    //"delete" from requests, go into rejection dashboard, also later
}

//do search based on name
//sort filters based on what's there for inventory records already.

export async function searchRequest(query: string, params: DonationSearchParams): Promise<DonationRequest[]> {
    
    const querySnapshot = await getDocs(collection(db, DONATIONS_COLLECTION));
    const requests: DonationRequest[] = querySnapshot.docs.map(doc => (
        doc.data() as DonationRequest
    ));

    return requests
    .filter(request => {
        const donorFullName = `${request.donor.firstName} ${request.donor.lastName}`.toLowerCase();
        const searchq = query.toLowerCase();

        //status depends on the donationitems, need to map through that array to define the status. 
        if (params.status.length != 0) {
            const startedRequest = request.items.some(donItem => donItem.status === "Approved" || donItem.status === "Denied");
            const completedRequest = request.items.every(donItem => donItem.status === "Approved" || donItem.status === "Denied");
            
            let requestStat: "Not Reviewed" | "Unfinished" | "Finished";

            if (!startedRequest){
                requestStat = "Not Reviewed"
            } else if (!completedRequest){
                requestStat = "Unfinished"
            } else{ 
                requestStat = "Finished"
            };
            
            if (!params.status.includes(requestStat)) {
                return false;
            }
        }

        return donorFullName.includes(searchq);     
    })

    //still need to sort by category

    .sort((req1, req2) => {
        let diff;
        if(params.sortBy == "Date") {
            diff = req1.date.seconds - req2.date.seconds;
        } else if (params.sortBy == "Quantity") {
            diff = req1.items.length - req2.items.length;
        } else {
            // Sort by donor name
            diff = `${req1.donor.lastName} ${req1.donor.firstName}`.localeCompare(`${req2.donor.lastName} ${req2.donor.firstName}`);
        }

        if (!params.ascending) {
            diff *= -1;
        }

        return diff
    });
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

  const docRef = await setDoc(doc(db, DONATIONS_COLLECTION, request.id), donationDoc);
  return request.id;
}

export async function uploadPhotos(
  id: string,
  files: File[],
  maxWidth: number = 800,
  quality: number = 0.85

): Promise<InventoryPhoto[]> {
  const photos: InventoryPhoto[] = [];
  const storage = getStorage();
  const db = getFirestore();
  console.log("uploadPhotos called with files:", files);
  for (const file of files) {
    //go through all the uploaded files and compress the images
    const blob = await new Promise<Blob>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const target = event.target;
        if (!target || !target.result) return reject(new Error("Failed to read file."));

        const img = new Image();
        //using canvas to compress the image
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("Failed to get canvas context."));

          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (b) => {
              if (b) resolve(b);
              else reject(new Error("Failed to create Blob from canvas."));
            },
            "image/jpeg",
            quality
          );
        };

        img.onerror = () => reject(new Error("Failed to load image."));
        img.src = target.result as string;
      };

      reader.onerror = () => reject(new Error("FileReader error."));
      reader.readAsDataURL(file);
    });

    // uploading compressed image to firebase
    const storageRef = ref(storage, `images/${id}/${file.name}`);
    await uploadBytes(storageRef, blob);

    const url = await getDownloadURL(storageRef);
    console.log("Got download URL:", url);

    //add all the impacts to the photos array 
     photos.push({
      url,
      altText: file.name,
    });
  }
    console.log(photos);
    return photos;

}
