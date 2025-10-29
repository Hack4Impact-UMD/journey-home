"use client";

import { useDonorForm } from "../DonorFormContext";
import StepIndicator from "../components/StepIndicator";
import Button from "../components/Button";
import { Timestamp } from "firebase/firestore";
import { createDonationRequest } from "../../../lib/services/donations";
import { v4 as uuidv4 } from "uuid";
import { DonationRequest, DonationItem } from "../../../types/donations";



export default function Step3Review() {
  const { formState, setCurrentStep } = useDonorForm();

  type FormDonationItem = {
    name: string;
    category: string;
    size: string;
    quantity: number;
    notes?: string;
    photos?: string[];
  };
  const handleBack = () => {
    setCurrentStep(2);
  };

  const handleSubmit = async () => {
    try {
      const donor = {
        firstName: formState.donorInfo.firstName ?? "",
        lastName: formState.donorInfo.lastName ?? "",
        email: formState.donorInfo.email ?? "",
        phoneNumber: formState.donorInfo.phoneNumber ?? "",
        address: formState.donorInfo.address ?? {
          streetAddress: "",
          city: "",
          state: "",
          zipCode: ""
        },
      };

      const validSizes = ["Small", "Medium", "Large"] as const;
      type Size = (typeof validSizes)[number];
      const items: DonationItem[] = (formState.donationItems as FormDonationItem[]).map((item) => {
        const size = validSizes.includes(item.size as Size) ? (item.size as Size) : "Medium";

        return {
          item: {
            id: uuidv4(),
            name: item.name ?? "",
            category: item.category ?? "",
            size,
            quantity: item.quantity ?? 1,
            notes: item.notes ?? "",
            dateAdded: Timestamp.now(),
            donorEmail: donor.email,
            photos: (item.photos ?? []).map((p) => ({ url: p, altText: "" })),
          },
          status: "Not Reviewed" as const,
        };
      });

      const request: DonationRequest = {
        donor,
        firstTimeDonor: formState.firstTimeDonor ?? true,
        howDidYouHear: formState.howDidYouHear ?? "",
        canDropOff: formState.canDropOff ?? false,
        notes: formState.notes ?? "",
        date: Timestamp.now(),
        items,
      };

      const docId = await createDonationRequest(request);
      console.log("Donation request created with ID:", docId);

      setCurrentStep(4);
    } catch (error) {
      console.error("Error submitting donation request:", error);
      alert("There was a problem submitting your donation. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-8">
        <img
          src="/journey-home-logo.png"
          alt="Journey Home Logo"
          className="h-24"
        />
      </div>

      <StepIndicator currentStep={3} />

      <h2 className="text-2xl font-bold text-gray-900 mb-4">Personal Information</h2>

      <div className="border border-gray-300 rounded">
        <div className="grid grid-cols-2 gap-y-6 p-6">
          <div className="font-semibold text-gray-900">Name</div>
          <div className="text-gray-700">
            {formState.donorInfo.firstName || ""} {formState.donorInfo.lastName || ""}
          </div>

          <div className="font-semibold text-gray-900">Phone Number</div>
          <div className="text-gray-700">{formState.donorInfo.phoneNumber || ""}</div>

          <div className="font-semibold text-gray-900">Email</div>
          <div className="text-gray-700">{formState.donorInfo.email || ""}</div>

          <div className="font-semibold text-gray-900">Address</div>
          <div className="text-gray-700">
            {formState.donorInfo.address?.streetAddress || ""}
            {formState.donorInfo.address?.streetAddress && formState.donorInfo.address?.city && ", "}
            {formState.donorInfo.address?.city || ""} CT {formState.donorInfo.address?.zipCode || ""}
          </div>

          <div className="font-semibold text-gray-900">How did you hear about Journey Home?</div>
          <div className="text-gray-700">{formState.howDidYouHear || ""}</div>

          <div className="font-semibold text-gray-900">Donation Method</div>
          <div className="text-gray-700">
            {formState.canDropOff ? "Drop-Off" : "Pick-Up"}
          </div>

          <div className="font-semibold text-gray-900">Acknowledged suggested donation?</div>
          <div className="text-gray-700">
            {formState.acknowledgeSuggestedDonation ? "Yes" : "No"}
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">Donations</h2>

      {formState.donationItems.length === 0 ? (
        <div className="border border-gray-300 rounded p-6 text-center">
          <p className="text-gray-500">No donation items added</p>
        </div>
      ) : (
        <div className="border border-gray-300 rounded mb-6">
          {formState.donationItems.map((item, index) => (
            <div key={index} className={index > 0 ? "border-t" : ""}>
              <div className="bg-gray-100 px-6 py-4">
                <h3 className="font-semibold text-gray-900">Item {index + 1}</h3>
              </div>
              <div className="grid grid-cols-2 gap-y-6 p-6">
                <div className="font-semibold text-gray-900">Short Description</div>
                <div className="text-gray-700">{(item as any).name || "N/A"}</div>
                
                <div className="font-semibold text-gray-900">Category</div>
                <div className="text-gray-700">{(item as any).category || "N/A"}</div>
                
                <div className="font-semibold text-gray-900">Size</div>
                <div className="text-gray-700">{(item as any).size || "N/A"}</div>
                
                <div className="font-semibold text-gray-900">Quantity</div>
                <div className="text-gray-700">{(item as any).quantity || "N/A"}</div>
                
                {(item as any).notes && (
                  <>
                    <div className="font-semibold text-gray-900">Notes</div>
                    <div className="text-gray-700">{(item as any).notes}</div>
                  </>
                )}
                
                {(item as any).photos && (item as any).photos.length > 0 && (
                  <>
                    <div className="font-semibold text-gray-900">Photos</div>
                    <div className="flex gap-4">
                      {(item as any).photos.slice(0, 3).map((photo: any, photoIndex: number) => (
                        <div key={photoIndex} className="w-24 h-24 border rounded overflow-hidden">
                          <img
                            src={photo.url}
                            alt={photo.altText}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center gap-4 mt-8">
        <Button onClick={handleBack} variant="secondary" className="min-w-[150px]">
          Back
        </Button>
        <Button onClick={handleSubmit} variant="primary" className="min-w-[150px]">
          Submit
        </Button>
      </div>
    </div>
  );
}

