"use client";

import { useDonorForm } from "../DonorFormContext";
import StepIndicator from "../../../components/form/StepIndicator";
import Button from "../../../components/form/Button";
import { Timestamp } from "firebase/firestore";
import { createDonationRequest } from "../../../lib/services/donations";
import { DonationRequest, DonationItem } from "../../../types/donations";

export default function Step3Review() {
  const { formState, setCurrentStep } = useDonorForm();

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
          state: "CT",
          zipCode: ""
        },
      };

      const validSizes = ["Small", "Medium", "Large"];
      const items: DonationItem[] = formState.donationItems.map((donationItem) => {
        const size =
          donationItem.size && validSizes.includes(donationItem.size)
            ? donationItem.size
            : "Medium";

        return {
          item: {
            id: crypto.randomUUID(),
            name: donationItem.name ?? "",
            category: donationItem.category ?? "",
            size: size as "Small" | "Medium" | "Large",
            quantity: donationItem.quantity ?? 1,
            notes: donationItem.notes ?? "",
            dateAdded: Timestamp.now(),
            donorEmail: donor.email,
            photos: (donationItem.photos ?? []).map((photo) => ({
              url: photo,
              altText: donationItem.name ?? "",
            })),
          },
          status: "Not Reviewed" as const,
        };
      });

      const isFirstTimeDonor = formState.firstTimeDonor === null ? true : formState.firstTimeDonor;

      const request: DonationRequest = {
        id: crypto.randomUUID(),
        donor,
        firstTimeDonor: isFirstTimeDonor,
        howDidYouHear: formState.howDidYouHear ?? "",
        canDropOff: formState.canDropOff ?? false,
        notes: formState.notes ?? "",
        date: Timestamp.now(),
        items,
      };

      await createDonationRequest(request);
      setCurrentStep(4);
    } catch (e){
      console.error(e);
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
        <div className="rounded mb-6">
          {formState.donationItems.map((item, index) => (
            <div
              key={item.id}
              className="border border-[#D9D9D9] mt-6"
            >
              <div className="bg-gray-100 px-6 py-4">
                <h3 className="font-semibold text-gray-900">Item {index + 1}</h3>
              </div>
              <div className="grid grid-cols-2 gap-y-6 p-6">
                <div className="font-semibold text-gray-900">Short Description</div>
                <div className="text-gray-700">{item.name || "N/A"}</div>
                
                <div className="font-semibold text-gray-900">Category</div>
                <div className="text-gray-700">{item.category || "N/A"}</div>
                
                <div className="font-semibold text-gray-900">Size</div>
                <div className="text-gray-700">{item.size || "N/A"}</div>
                
                <div className="font-semibold text-gray-900">Quantity</div>
                <div className="text-gray-700">
                  {typeof item.quantity === "number" ? item.quantity : "N/A"}
                </div>
                
                {item.notes && (
                  <>
                    <div className="font-semibold text-gray-900">Notes</div>
                    <div className="text-gray-700">{item.notes}</div>
                  </>
                )}
                
                {item.photos && item.photos.length > 0 && (
                  <>
                    <div className="font-semibold text-gray-900">Photos</div>
                    <div className="flex gap-4">
                      {item.photos.slice(0, 3).map((photo: string, photoIndex: number) => (
                        <div key={photoIndex} className="w-24 h-24 border rounded overflow-hidden">
                          <img
                            src={photo}
                            alt="Donation item"
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
        <Button onClick={handleBack} variant="secondary" className="min-w-[9.375em]">
          Back
        </Button>
        <Button onClick={handleSubmit} variant="primary" className="min-w-[9.375em]">
          Submit
        </Button>
      </div>
    </div>
  );
}

