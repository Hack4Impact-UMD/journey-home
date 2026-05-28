"use client";

import { DonorFormProvider } from "./DonorFormContext";
import { usePageTitle } from "@/lib/usePageTitle";

export default function DonorFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  usePageTitle("Donate – Journey Home");
  return (
    <DonorFormProvider>
      <div className="min-h-screen bg-white md:bg-[#D8E3E5] md:py-8">
        <div className="p-5 md:p-8 md:max-w-4xl md:mx-auto md:bg-white md:rounded-lg md:shadow-md">
          {children}
        </div>
      </div>
    </DonorFormProvider>
  );
}

