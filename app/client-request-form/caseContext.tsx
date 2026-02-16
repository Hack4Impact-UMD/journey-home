"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Client, ClientQuestions, ClientSecondaryContact } from "@/types/client-requests"; 

export type Bedding = {
  twinbeds: number;
  fullbeds: number;
  queenbeds: number;
  sheets: number;
  blanket: number;
  pillows: number;
};

export type Tables = {
  sofa: number;
  armchair: number;
  kitchenchair: number;
  kitchentable: number;
  coffeetable: number;
  endtable: number;
};

export type Kitchen = {
  sofa: number;
  armchair: number;
  kitchenchair: number;
  kitchentable: number;
  coffeetable: number;
  endtable: number;
};

export type Other = {
  dresser: number;
  fan: number;
  heater: number;
  towelset: number;
  lamp: number;
  //add custom optional
};

export type CustomItem = {
    id: string;
    name: string;
    quantity: number;
}

interface CaseFormState {
  currentStep: number;
  clientInfoAndNewHome: Client;
  bedding: Bedding;
  tables: Tables;
  kitchen: Kitchen;
  other: Other;
}

const defaultState: CaseFormState = {
  currentStep: 1,
  clientInfoAndNewHome: {
    hmis: "",
    secondaryContact: {
        nameAndRelationship: "",
        phone: ""
    },
    questions: {
      clientSpeaksEnglish: undefined,
      adultsInFamily: undefined,
      childrenInFamily: undefined,
      isVeteran: undefined,
      canPickUp: undefined,
      wasChronic: undefined,
      hasMovedIn: undefined,
      moveInDate: undefined,
      hasElevator: undefined,
      notes: ""
    },
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: {
      streetAddress: "",
      apt: "",
      city: "",
      state: "",
      zipCode: ""
    }
  },
  bedding: {
    twinbeds: 0,
    fullbeds: 0,
    queenbeds: 0,
    sheets: 0,
    blanket: 0,
    pillows: 0
  },
  tables: {
    sofa: 0,
    armchair: 0,
    kitchenchair: 0,
    kitchentable: 0,
    coffeetable: 0,
    endtable: 0
  },
  kitchen: {
    sofa: 0,
    armchair: 0,
    kitchenchair: 0,
    kitchentable: 0,
    coffeetable: 0,
    endtable: 0
  },
  other: {
    dresser: 0,
    fan: 0,
    heater: 0,
    towelset: 0,
    lamp: 0
  }
};

export interface CaseFormContextType {
  formState: CaseFormState;

  updateClientInfo: (info: Partial<Client>) => void;
  updateClientQuestions: (questions: Partial<ClientQuestions>) => void;
  updateSecondaryContact: (contact: Partial<ClientSecondaryContact>) => void;

  updateBedding: (bedding: Partial<Bedding>) => void;
  updateTables: (tables: Partial<Tables>) => void;
  updateKitchen: (kitchen: Partial<Kitchen>) => void;
  updateOther: (other: Partial<Other>) => void;

  setCurrentStep: (step: number) => void;
}

const CaseFormContext = createContext<CaseFormContextType | undefined>(undefined);

export function CaseFormProvider({ children }: { children: ReactNode }) {
    const [formState, setFormState] = useState<CaseFormState>(defaultState);

    const updateClientInfo = (info: Partial<Client>) => {
        setFormState((prev) => ({
            ...prev,
            clientInfoAndNewHome: {
            ...prev.clientInfoAndNewHome,
            ...info,
            },
        }));
    };

    const updateClientQuestions = (questions: Partial<ClientQuestions>) => {
        setFormState((prev) => ({
            ...prev,
            clientInfoAndNewHome: {
                ...prev.clientInfoAndNewHome,
                questions: {
                    ...prev.clientInfoAndNewHome.questions,
                    ...questions,
                },
            },
        }));
    };

    const updateSecondaryContact = (contact: Partial<ClientSecondaryContact>) => {
        setFormState((prev) => ({
            ...prev,
            clientInfoAndNewHome: {
                ...prev.clientInfoAndNewHome,
                secondaryContact: {
                    ...prev.clientInfoAndNewHome.secondaryContact,
                    ...contact,
                },
            },
        }));
    };

    const updateBedding = (bedding: Partial<Bedding>) => {
        setFormState((prev) => ({
            ...prev,
            bedding: {
                ...prev.bedding,
                ...bedding,
            },
        }));
    };

    const updateTables = (tables: Partial<Tables>) => {
        setFormState((prev) => ({
            ...prev,
            tables: {
                ...prev.tables,
                ...tables,
            },
        }));
    };

    const updateKitchen = (kitchen: Partial<Kitchen>) => {
        setFormState((prev) => ({
            ...prev,
            kitchen: {
                ...prev.kitchen,
                ...kitchen,
            },
        }));
    };

    const updateOther = (other: Partial<Other>) => {
        setFormState((prev) => ({
            ...prev,
            other: {
            ...prev.other,
            ...other,
            },
        }));
    };

    const setCurrentStep = (step: number) => {
    setFormState((prev) => ({
      ...prev,
      currentStep: step,
    }));
  };
  return (
    <CaseFormContext.Provider
        value={{
            formState,
            updateClientInfo,
            updateClientQuestions,
            updateSecondaryContact,
            updateBedding,
            updateTables,
            updateKitchen,
            updateOther,
            setCurrentStep,
        }}
        >
        {children}
    </CaseFormContext.Provider>
  );
}

export function useCaseForm() {
  const context = useContext(CaseFormContext);
  if (context === undefined) {
    throw new Error("useCaseForm must be used within CaseFormProvider");
  }
  return context;
}