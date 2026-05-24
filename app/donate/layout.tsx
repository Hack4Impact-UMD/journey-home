"use client";

import { DonorFormProvider } from "./DonorFormContext";
import { usePageTitle } from "@/lib/usePageTitle";

export default function DonorFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  usePageTitle("Donate | Journey Home");
  return (
    <DonorFormProvider>
      <div className="min-h-screen py-8 bg-[#D8E3E5]">
        <div className="max-w-4xl mx-auto bg-white rounded-lg p-8 shadow-md">
          {children}
        </div>
      </div>
    </DonorFormProvider>
  );
}

