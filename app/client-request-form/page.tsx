"use client";

import { useCaseForm } from "./caseContext";
import Step1ClientInfo from "./steps/Step1ClientInfo";
import Step2Requests from "./steps/Step2Requests";
import Step3Review from "./steps/Step3Review"
import Step4Confirmation from "./steps/Step4Confirmation";

export default function ClientRequestFormPage() {

    const { formState } = useCaseForm();

    if (formState.currentStep === 1) {
        return <Step1ClientInfo />;
    }
    if (formState.currentStep === 2) {
        return <Step2Requests />;
    }
    if (formState.currentStep === 3) {
        return <Step3Review />;
    }
    if (formState.currentStep === 4) {
        return <Step4Confirmation />;
    }
    
    return <Step1ClientInfo />;
}