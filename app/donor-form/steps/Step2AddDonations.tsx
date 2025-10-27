"use client";

import { useState } from "react";
import { useDonorForm } from "../DonorFormContext";
import StepIndicator from "../components/StepIndicator";
import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";
import FormTextarea from "../components/FormTextarea";
import Button from "../components/Button";

export default function Step2AddDonations() {
  const { formState, setCurrentStep, addDonationItem, removeDonationItem, updateDonationItem } = useDonorForm();
  const [showFullList, setShowFullList] = useState(false);
  
  // Local state for donation items input
  const [donationInputs, setDonationInputs] = useState<Record<string, any>>({});
  
  const updateDonationInput = (index: number, field: string, value: any) => {
    const key = `item-${index}-${field}`;
    setDonationInputs(prev => ({
      ...prev,
      [key]: value
    }));
    updateDonationItem(index, { [field]: value });
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleNext = () => {
    setCurrentStep(3);
  };

  const categoryOptions = [
    { value: "mattresses", label: "Mattresses" },
    { value: "box-springs", label: "Box Springs" },
    { value: "sofas", label: "Sofas" },
    { value: "loveseats", label: "Loveseats" },
    { value: "kitchen-tables", label: "Kitchen Tables" },
    { value: "kitchen-chairs", label: "Kitchen Chairs" },
    { value: "armchairs", label: "Armchairs" },
    { value: "coffee-tables", label: "Coffee Tables" },
    { value: "dressers", label: "Dressers" },
    { value: "nightstands-end-tables", label: "Nightstands/End Tables" },
    { value: "tvs", label: "TV's" },
    { value: "tv-stands", label: "TV Stands" },
    { value: "microwave-stands", label: "Microwave Stands" },
    { value: "small-bookshelves", label: "Small Bookshelves" },
    { value: "area-rugs", label: "Area Rugs" },
  ];

  const sizeOptions = [
    { value: "Small", label: "Small" },
    { value: "Medium", label: "Medium" },
    { value: "Large", label: "Large" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-8">
        <img
          src="/journey-home-logo.png"
          alt="Journey Home Logo"
          className="h-24"
        />
      </div>

      <StepIndicator currentStep={2} />

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Items We Accept</h2>
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <p className="mb-2">
              Items that we accept and <span className="font-normal">need this form to be filled out</span> for can be viewed in the category dropdown below. Items that we accept but <span className="font-bold">do not need the form for</span> are listed below. These items can be dropped off at our warehouse or picked up with other larger items. Please contact volunteer@journeyhomect.org for any questions.
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Sheets</li>
              <li>Blankets/comforters</li>
              <li>Bath towels/hand towels/washcloths</li>
              {showFullList && (
                <>
                  <li>Shower curtains/rings/liners</li>
                  <li>Shower curtain rods</li>
                  <li>Pillows</li>
                  <li>Microwaves</li>
                  <li>Toasters</li>
                  <li>Coffee makers</li>
                  <li>Blenders</li>
                  <li>Air fryers</li>
                  <li>Rice cookers</li>
                  <li>Crock pots</li>
                  <li>Plates</li>
                  <li>Bowls</li>
                  <li>Coffee mugs</li>
                  <li>Drinking glasses</li>
                  <li>Silverware</li>
                  <li>Cooking utensils</li>
                  <li>Pots & pans</li>
                  <li>Lamps</li>
                  <li>Brooms/dustpans</li>
                  <li>Mops/buckets</li>
                  <li>Unopened toilet paper/paper towels</li>
                  <li>Laundry baskets</li>
                  <li>Plungers</li>
                  <li>Sponges</li>
                </>
              )}
            </ul>
            <button
              onClick={() => setShowFullList(!showFullList)}
              className="text-gray-500 mt-2 hover:text-gray-700"
            >
              {showFullList ? "Collapse list" : "Expand for full list"}
            </button>
          </div>

          <div className="mt-6">
            <p className="mb-2">
              We do <span className="font-extrabold">not</span> accept the following items:
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Sofa beds</li>
            </ul>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900">Add Donations</h2>

      {formState.donationItems.length === 0 && (
        <div className="border border-gray-300 rounded p-6 text-center">
          <p className="text-gray-500 mb-4">No donation items added yet</p>
          <Button onClick={addDonationItem} variant="secondary">
            + Add Item
          </Button>
        </div>
      )}

      {formState.donationItems.map((item, index) => (
        <div key={index} className="border border-gray-300 rounded p-6 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Item {index + 1}</h3>
            {formState.donationItems.length > 1 && (
              <button
                onClick={() => removeDonationItem(index)}
                className="text-red-500 hover:text-red-700"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>

          <div className="space-y-4">
            <FormInput
              label="Short description (1-3 words)"
              value={donationInputs[`item-${index}-name`] || ""}
              onChange={(e) => updateDonationInput(index, "name", e.target.value)}
            />

            <FormSelect
              label="Category"
              required
              value={donationInputs[`item-${index}-category`] || ""}
              onChange={(e) => updateDonationInput(index, "category", e.target.value)}
              options={categoryOptions}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormSelect
                label="Size"
                required
                value={donationInputs[`item-${index}-size`] || ""}
                onChange={(e) => updateDonationInput(index, "size", e.target.value)}
                options={sizeOptions}
              />

              <FormInput
                label="Quantity"
                required
                type="number"
                value={donationInputs[`item-${index}-quantity`] || ""}
                onChange={(e) => updateDonationInput(index, "quantity", parseInt(e.target.value) || 0)}
              />
            </div>

            <FormTextarea
              label="Notes"
              value={donationInputs[`item-${index}-notes`] || ""}
              onChange={(e) => updateDonationInput(index, "notes", e.target.value)}
              rows={3}
            />

            <div>
              <label className="text-sm text-gray-700 mb-2 block">Photos (5 maximum)</label>
              <div className="border-2 border-dashed border-gray-300 rounded p-8 text-center">
                <div className="flex flex-col items-center justify-center gap-4">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <div className="text-center">
                    <p className="text-gray-700 mb-1">Click or drag file to this area to upload</p>
                    <p className="text-sm text-gray-500">Support for a single or bulk upload.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="border border-gray-300 rounded-t cursor-pointer">
        <button
          onClick={addDonationItem}
          className="w-full py-2 px-4 flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <Button onClick={handleBack} variant="secondary" className="min-w-[150px]">
          Back
        </Button>
        <Button onClick={handleNext} variant="primary" className="min-w-[150px]">
          Next
        </Button>
      </div>
    </div>
  );
}

