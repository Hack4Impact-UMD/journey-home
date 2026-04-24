"use client";

import { CaseFormProvider } from "./caseContext";
import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import Link from "next/link";

export default function CaseFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allow={["Case Manager"]}>
      <CaseFormProvider>
        <div className="min-h-screen py-8 bg-[#D8E3E5]">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-8 shadow-md">
              <Link href="/" className="inline-flex items-center gap-1 text-sm text-primary hover:opacity-70 mb-3">
                ← Back Home
              </Link>
              {children}
            </div>
          </div>
        </div>
      </CaseFormProvider>
    </ProtectedRoute>
  );
}
