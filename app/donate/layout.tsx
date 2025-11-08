"use client";

import { DonorFormProvider } from "./DonorFormContext";

export default function DonorFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

