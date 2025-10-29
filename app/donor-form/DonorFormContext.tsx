"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { DonorInfo, DonationItem } from "@/types/donations";

interface DonorFormState {
  currentStep: number;
  donorInfo: Partial<DonorInfo>;
  donationItems: Partial<DonationItem>[];
  firstTimeDonor: boolean | null;
  howDidYouHear: string;
  canDropOff: boolean | null;
  notes: string;
  acknowledgeSuggestedDonation: boolean;
  acknowledgeRefuseRight: boolean;
  acknowledgeItemCondition: boolean;
}

interface DonorFormContextType {
  formState: DonorFormState;
  updateDonorInfo: (info: Partial<DonorInfo>) => void;
  updateDonationItems: (items: Partial<DonationItem>[]) => void;
  updateAdditionalInfo: (data: Partial<Pick<DonorFormState, "firstTimeDonor" | "howDidYouHear" | "canDropOff" | "notes">>) => void;
  updateAcknowledgements: (data: Partial<Pick<DonorFormState, "acknowledgeSuggestedDonation" | "acknowledgeRefuseRight" | "acknowledgeItemCondition">>) => void;
  setCurrentStep: (step: number) => void;
  addDonationItem: () => void;
  removeDonationItem: (index: number) => void;
  updateDonationItem: (index: number, item: Partial<DonationItem>) => void;
}

const defaultState: DonorFormState = {
  currentStep: 1,
  donorInfo: {},
  donationItems: [],
  firstTimeDonor: null,
  howDidYouHear: "",
  canDropOff: null,
  notes: "",
  acknowledgeSuggestedDonation: false,
  acknowledgeRefuseRight: false,
  acknowledgeItemCondition: false,
};

const DonorFormContext = createContext<DonorFormContextType | undefined>(undefined);

export function DonorFormProvider({ children }: { children: ReactNode }) {
  const [formState, setFormState] = useState<DonorFormState>(defaultState);

  const updateDonorInfo = (info: Partial<DonorInfo>) => {
    setFormState((prev) => ({
      ...prev,
      donorInfo: { ...prev.donorInfo, ...info },
    }));
  };

  const updateDonationItems = (items: Partial<DonationItem>[]) => {
    setFormState((prev) => ({
      ...prev,
      donationItems: items,
    }));
  };

  const updateAdditionalInfo = (data: Partial<Pick<DonorFormState, "firstTimeDonor" | "howDidYouHear" | "canDropOff" | "notes">>) => {
    setFormState((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const updateAcknowledgements = (data: Partial<Pick<DonorFormState, "acknowledgeSuggestedDonation" | "acknowledgeRefuseRight" | "acknowledgeItemCondition">>) => {
    setFormState((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const setCurrentStep = (step: number) => {
    setFormState((prev) => ({
      ...prev,
      currentStep: step,
    }));
  };

  const addDonationItem = () => {
    setFormState((prev) => ({
      ...prev,
      donationItems: [...prev.donationItems, {}],
    }));
  };

  const removeDonationItem = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      donationItems: prev.donationItems.filter((_, i) => i !== index),
    }));
  };

  const updateDonationItem = (index: number, item: Partial<DonationItem>) => {
    setFormState((prev) => ({
      ...prev,
      donationItems: prev.donationItems.map((existingItem, i) =>
        i === index ? { ...existingItem, ...item } : existingItem
      ),
    }));
  };

  return (
    <DonorFormContext.Provider
      value={{
        formState,
        updateDonorInfo,
        updateDonationItems,
        updateAdditionalInfo,
        updateAcknowledgements,
        setCurrentStep,
        addDonationItem,
        removeDonationItem,
        updateDonationItem,
      }}
    >
      {children}
    </DonorFormContext.Provider>
  );
}

export function useDonorForm() {
  const context = useContext(DonorFormContext);
  if (context === undefined) {
    throw new Error("useDonorForm must be used within DonorFormProvider");
  }
  return context;
}


