"use client";

import { useDonorForm } from "./DonorFormContext";
import Step1PersonalInfo from "./steps/Step1PersonalInfo";
import Step2AddDonations from "./steps/Step2AddDonations";
import Step3Review from "./steps/Step3Review";
import Step4Confirmation from "./steps/Step4Confirmation";

export default function DonorFormPage() {
  const { formState } = useDonorForm();

  //show different step based on the current step number
  if (formState.currentStep === 1) {
    return <Step1PersonalInfo />;
  }
  if (formState.currentStep === 2) {
    return <Step2AddDonations />;
  }
  if (formState.currentStep === 3) {
    return <Step3Review />;
  }
  if (formState.currentStep === 4) {
    return <Step4Confirmation />;
  }
  //default to step 1 if something goes wrong
  return <Step1PersonalInfo />;
}

