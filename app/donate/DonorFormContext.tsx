"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { DonorInfo } from "@/types/donations";

export type FormDonationItem = {
  id: string;
  name: string;
  category: string;
  size: string;
  quantity: number | null;
  notes: string;
  photos: string[];
};

interface DonorFormState {
  currentStep: number;
  donorInfo: Partial<DonorInfo>;
  donationItems: FormDonationItem[];
  donationItemFiles: { [id: string]: File[] };
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
  updateDonationItems: (items: FormDonationItem[]) => void;
  updateAdditionalInfo: (
    data: Partial<Pick<DonorFormState, "firstTimeDonor" | "howDidYouHear" | "canDropOff" | "notes">>
  ) => void;
  updateAcknowledgements: (
    data: Partial<
      Pick<
        DonorFormState,
        "acknowledgeSuggestedDonation" | "acknowledgeRefuseRight" | "acknowledgeItemCondition"
      >
    >
  ) => void;
  setCurrentStep: (step: number) => void;
  addDonationItem: () => void;
  removeDonationItem: (id: string) => void;
  updateDonationItem: (id: string, item: Partial<FormDonationItem>) => void;
  updateDonationItemFiles: (id: string, files: File[]) => void;
}

const defaultState: DonorFormState = {
  currentStep: 1,
  donorInfo: {},
  donationItems: [],
  donationItemFiles: {},
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

  const updateDonationItems = (items: FormDonationItem[]) => {
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
    const newItem: FormDonationItem = {
      id: crypto.randomUUID(),
      name: "",
      category: "",
      size: "",
      quantity: null,
      notes: "",
      photos: [],
    };

    setFormState((prev) => ({
      ...prev,
      donationItems: [...prev.donationItems, newItem],
    }));
  };

  const removeDonationItem = (id: string) => {
    setFormState((prev) => ({
      ...prev,
      donationItems: prev.donationItems.filter((item) => item.id !== id),
    }));
  };

  const updateDonationItem = (id: string, item: Partial<FormDonationItem>) => {
    setFormState((prev) => ({
      ...prev,
      donationItems: prev.donationItems.map((existingItem) =>
        existingItem.id === id ? { ...existingItem, ...item } : existingItem
      ),
    }));
  };
  const updateDonationItemFiles = (id: string, files: File[]) => {
  setFormState((prev) => ({
    ...prev,
    donationItemFiles: {
      ...prev.donationItemFiles,
      [id]: files,
    },
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
        updateDonationItemFiles,
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


