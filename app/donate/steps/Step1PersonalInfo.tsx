"use client";

import { useState } from "react";
import { useDonorForm } from "../DonorFormContext";
import StepIndicator from "../../../components/form/StepIndicator";
import FormInput from "../../../components/form/FormInput";
import FormSelect from "../../../components/form/FormSelect";
import FormTextarea from "../../../components/form/FormTextarea";
import FormCheckbox from "../../../components/form/FormCheckbox";
import Button from "../../../components/form/Button";
import Image from "next/image";
import { formatPhone } from "@/lib/utils/phone";

export default function Step1PersonalInfo() {
  const { formState, updateDonorInfo, updateAdditionalInfo, updateAcknowledgements, setCurrentStep } = useDonorForm();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const predefinedCityOptions = [
    "Avon", "Bloomfield", "Canton", "East Granby", "East Hartford", "East Windsor",
    "Farmington", "Glastonbury", "Granby", "Hartford", "Manchester", "Newington",
    "Rocky Hill", "Simsbury", "South Windsor", "Vernon", "West Hartford",
    "Wethersfield", "Windsor", "Windsor Locks",
  ];
  const [citySelect, setCitySelect] = useState<string>(
    predefinedCityOptions.includes(formState.donorInfo.address?.city ?? "")
      ? (formState.donorInfo.address?.city ?? "")
      : formState.donorInfo.address?.city
      ? "Other"
      : ""
  );

  const predefinedHearOptions = ["Friend", "Social Media", "Website", "Flyer"];
  const [hearSelect, setHearSelect] = useState<string>(
    predefinedHearOptions.includes(formState.howDidYouHear)
      ? formState.howDidYouHear
      : formState.howDidYouHear
      ? "Other"
      : ""
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required contact fields
    if (!formState.donorInfo.firstName) {
      newErrors.firstName = "First name is required";
    }
    if (!formState.donorInfo.lastName) {
      newErrors.lastName = "Last name is required";
    }
    if (!formState.donorInfo.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(formState.donorInfo.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a complete phone number in the format 123-456-7890.";
    }
    if (!formState.donorInfo.email) {
      newErrors.email = "Email is required";
    }

    // Required address fields
    if (!formState.donorInfo.address?.streetAddress) {
      newErrors.streetAddress = "Street address is required";
    }
    if (!formState.donorInfo.address?.city) {
      newErrors.city = "City/Town is required";
    }
    if (!formState.donorInfo.address?.zipCode) {
      newErrors.zipCode = "Zip code is required";
    } else if (!/^\d{5}$/.test(formState.donorInfo.address.zipCode)) {
      newErrors.zipCode = "Zip code must be 5 digits";
    }

    // Required additional questions
    if (formState.canDropOff === null) {
      newErrors.canDropOff = "Please specify if you can drop off items";
    }

    // Required acknowledgements
    if (!formState.acknowledgeSuggestedDonation) {
      newErrors.acknowledgeSuggestedDonation = "This acknowledgement is required";
    }
    if (!formState.acknowledgeRefuseRight) {
      newErrors.acknowledgeRefuseRight = "This acknowledgement is required";
    }
    if (!formState.acknowledgeItemCondition) {
      newErrors.acknowledgeItemCondition = "This acknowledgement is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setCurrentStep(2);
    } else {
      setTimeout(() => {
        document.querySelector<HTMLElement>(".form-error")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 0);
    }
  };

  const firstTimeDonorOptions = ["Yes", "No"];

  const howDidYouHearOptions = [...predefinedHearOptions, "Other"];

  const canDropOffOptions = ["Yes", "No"];

  const cityOptions = [...predefinedCityOptions, "Other"];

  const steps = [
    { number: 1, label: "Personal Information" },
    { number: 2, label: "Donations" },
    { number: 3, label: "Review" },
  ];
  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-8">
        <Image
          src="/journey-home-logo.png"
          alt="Journey Home Logo"
          height={96}
          width={350}
          className="h-24 w-auto"
        />
      </div>

      <StepIndicator currentStep={1} steps={steps}/>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <FormInput
              label="First Name"
              required
              value={formState.donorInfo.firstName || ""}
              onChange={(e) => {
                updateDonorInfo({ firstName: e.target.value });
                if (errors.firstName) setErrors({ ...errors, firstName: "" });
              }}
            />
            {errors.firstName && <p className="form-error text-red-500 text-sm mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <FormInput
              label="Last Name"
              required
              value={formState.donorInfo.lastName || ""}
              onChange={(e) => {
                updateDonorInfo({ lastName: e.target.value });
                if (errors.lastName) setErrors({ ...errors, lastName: "" });
              }}
            />
            {errors.lastName && <p className="form-error text-red-500 text-sm mt-1">{errors.lastName}</p>}
          </div>
        </div>

        <div>
          <FormInput
            label="Phone Number"
            required
            type="tel"
            placeholder="XXX-XXX-XXXX"
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Please enter a complete phone number in the format 123-456-7890.")}
            value={formState.donorInfo.phoneNumber || ""}
            onChange={(e) => {
              e.target.setCustomValidity("");
              updateDonorInfo({ phoneNumber: formatPhone(e.target.value) });
              if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: "" });
            }}
          />
          {errors.phoneNumber && <p className="form-error text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
        </div>

        <div>
          <FormInput
            label="Email"
            required
            type="email"
            value={formState.donorInfo.email || ""}
            onChange={(e) => {
              updateDonorInfo({ email: e.target.value });
              if (errors.email) setErrors({ ...errors, email: "" });
            }}
          />
          {errors.email && <p className="form-error text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Address</h2>

        <div>
          <FormInput
            label="Street Address"
            required
            value={formState.donorInfo.address?.streetAddress || ""}
            onChange={(e) => {
              updateDonorInfo({
                address: {
                  streetAddress: e.target.value,
                  apt: formState.donorInfo.address?.apt || "",
                  city: formState.donorInfo.address?.city || "",
                  state: formState.donorInfo.address?.state || "CT",
                  zipCode: formState.donorInfo.address?.zipCode || ""
                },
              });
              if (errors.streetAddress) setErrors({ ...errors, streetAddress: "" });
            }}
          />
          {errors.streetAddress && <p className="form-error text-red-500 text-sm mt-1">{errors.streetAddress}</p>}
        </div>

        <div>
          <FormInput
            label="Apt / Unit"
            value={formState.donorInfo.address?.apt || ""}
            onChange={(e) =>
              updateDonorInfo({
                address: {
                  streetAddress: formState.donorInfo.address?.streetAddress || "",
                  apt: e.target.value,
                  city: formState.donorInfo.address?.city || "",
                  state: formState.donorInfo.address?.state || "CT",
                  zipCode: formState.donorInfo.address?.zipCode || ""
                },
              })
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <FormSelect
              label="City/Town"
              required
              value={citySelect}
              onChange={(e) => {
                const val = e.target.value;
                setCitySelect(val);
                if (val !== "Other") {
                  updateDonorInfo({
                    address: {
                      streetAddress: formState.donorInfo.address?.streetAddress || "",
                      apt: formState.donorInfo.address?.apt || "",
                      city: val,
                      state: formState.donorInfo.address?.state || "CT",
                      zipCode: formState.donorInfo.address?.zipCode || ""
                    },
                  });
                } else {
                  updateDonorInfo({
                    address: {
                      streetAddress: formState.donorInfo.address?.streetAddress || "",
                      apt: formState.donorInfo.address?.apt || "",
                      city: "",
                      state: formState.donorInfo.address?.state || "CT",
                      zipCode: formState.donorInfo.address?.zipCode || ""
                    },
                  });
                }
                if (errors.city) setErrors({ ...errors, city: "" });
              }}
              options={cityOptions}
            />
            {citySelect === "Other" && (
              <div className="mt-4">
              <FormInput
                label="Enter your city/town"
                required
                value={formState.donorInfo.address?.city || ""}
                onChange={(e) => {
                  updateDonorInfo({
                    address: {
                      streetAddress: formState.donorInfo.address?.streetAddress || "",
                      apt: formState.donorInfo.address?.apt || "",
                      city: e.target.value,
                      state: formState.donorInfo.address?.state || "CT",
                      zipCode: formState.donorInfo.address?.zipCode || ""
                    },
                  });
                  if (errors.city) setErrors({ ...errors, city: "" });
                }}
              />
              </div>
            )}
            {errors.city && <p className="form-error text-red-500 text-sm mt-1">{errors.city}</p>}
          </div>
          <div>
            <p className="text-sm text-gray-700 pb-2">State</p>
            <div className="border border-gray-300 rounded px-3 py-2 bg-gray-100">
              CT
            </div>
          </div>
          <div>
            <FormInput
              label="Zip Code"
              required
              value={formState.donorInfo.address?.zipCode || ""}
              onChange={(e) => {
                updateDonorInfo({
                  address: {
                    streetAddress: formState.donorInfo.address?.streetAddress || "",
                    apt: formState.donorInfo.address?.apt || "",
                    city: formState.donorInfo.address?.city || "",
                    state: formState.donorInfo.address?.state || "CT",
                    zipCode: e.target.value.replace(/\D/g, "").slice(0, 5)
                  },
                });
                if (errors.zipCode) setErrors({ ...errors, zipCode: "" });
              }}
            />
            {errors.zipCode && <p className="form-error text-red-500 text-sm mt-1">{errors.zipCode}</p>}
          </div>
        </div>

        <p className="text-sm italic text-gray-700 mt-4">
          Only towns/cities within our pickup range are listed as an option above. If your town is not listed, you can select it through the Other option. If your town isn't listed, but you need a pickup, please contact volunteer@journeyhomect.org to see if a pickup is possible.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8">Additional Questions</h2>

        <FormSelect
          label="Have you donated to A Hand Up or Journey Home Before?"
          value={
            formState.firstTimeDonor === null
              ? ""
              : formState.firstTimeDonor
              ? "No"
              : "Yes"
          }
          onChange={(e) =>
            updateAdditionalInfo({
              firstTimeDonor:
                e.target.value === "Yes"
                  ? false
                  : e.target.value === "No"
                  ? true
                  : null,
            })
          }
          options={firstTimeDonorOptions}
        />

        <FormSelect
          label="How did you hear about Journey Home?"
          value={hearSelect}
          onChange={(e) => {
            const val = e.target.value;
            setHearSelect(val);
            if (val !== "Other") {
              updateAdditionalInfo({ howDidYouHear: val });
            } else {
              updateAdditionalInfo({ howDidYouHear: "" });
            }
          }}
          options={howDidYouHearOptions}
        />

        {hearSelect === "Other" && (
          <FormInput
            label="Please specify"
            value={formState.howDidYouHear}
            onChange={(e) =>
              updateAdditionalInfo({ howDidYouHear: e.target.value })
            }
          />
        )}

        <div>
          <FormSelect
            label="Can you drop off items at our warehouse located in West Hartford?"
            required
            value={
              formState.canDropOff === null
                ? ""
                : formState.canDropOff
                ? "Yes"
                : "No"
            }
            onChange={(e) => {
              updateAdditionalInfo({
                canDropOff:
                  e.target.value === "Yes"
                    ? true
                    : e.target.value === "No"
                    ? false
                    : null,
              });
              if (errors.canDropOff) setErrors({ ...errors, canDropOff: "" });
            }}
            options={canDropOffOptions}
          />
          {errors.canDropOff && <p className="form-error text-red-500 text-sm mt-1">{errors.canDropOff}</p>}
        </div>

        <FormTextarea
          label="Notes/comments"
          value={formState.notes}
          onChange={(e) =>
            updateAdditionalInfo({
              notes: e.target.value,
            })
          }
        />

        <h2 className="text-2xl font-bold text-gray-900 mt-8">Acknowledgements</h2>

        <div className="space-y-4">
          <div>
            <FormCheckbox
              required
              label="If you need a pick-up of your items, please acknowledge that there is a suggested donation of $50 requested to help fund this program."
              checked={formState.acknowledgeSuggestedDonation}
              onChange={(checked) => {
                updateAcknowledgements({ acknowledgeSuggestedDonation: checked });
                if (errors.acknowledgeSuggestedDonation) setErrors({ ...errors, acknowledgeSuggestedDonation: "" });
              }}
            />
            {errors.acknowledgeSuggestedDonation && <p className="text-red-500 text-sm mt-1 ml-6">{errors.acknowledgeSuggestedDonation}</p>}
          </div>

          <div>
            <FormCheckbox
              required
              label="I understand Journey Home has the right to refuse any item."
              checked={formState.acknowledgeRefuseRight}
              onChange={(checked) => {
                updateAcknowledgements({ acknowledgeRefuseRight: checked });
                if (errors.acknowledgeRefuseRight) setErrors({ ...errors, acknowledgeRefuseRight: "" });
              }}
            />
            {errors.acknowledgeRefuseRight && <p className="text-red-500 text-sm mt-1 ml-6">{errors.acknowledgeRefuseRight}</p>}
          </div>

          <div>
            <FormCheckbox
              required
              label="I understand that Journey Home WILL refuse items that are dirty, moldy, need to be disassembled, broken, or torn, or items that are missing parts."
              checked={formState.acknowledgeItemCondition}
              onChange={(checked) => {
                updateAcknowledgements({ acknowledgeItemCondition: checked });
                if (errors.acknowledgeItemCondition) setErrors({ ...errors, acknowledgeItemCondition: "" });
              }}
            />
            {errors.acknowledgeItemCondition && <p className="text-red-500 text-sm mt-1 ml-6">{errors.acknowledgeItemCondition}</p>}
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Button type="submit" variant="primary" className="min-w-50">
            Next
          </Button>
        </div>
      </form>
    </div>
  );
}

