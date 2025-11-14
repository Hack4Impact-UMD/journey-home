"use client";

import { useSearchParams } from "next/navigation";
import AccountPending from "./pending";
import AccountCreated from "./creation-confirmation";
import { Suspense } from "react";

function StatusContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  if (type === "created") {
    return <AccountCreated />;
  }

  // Default to pending if type is "pending" or not specified
  return <AccountPending />;
}

export default function StatusPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <p className="font-family-roboto">Loading...</p>
      </div>
    }>
      <StatusContent />
    </Suspense>
  );
}