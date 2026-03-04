"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import { useRouter } from "next/navigation";

export default function AccountCreated() {
  const router = useRouter();

  return (
    <ProtectedRoute allow={["Admin", "Case Manager", "Volunteer"]}>
      <div className="bg-background flex h-full overflow-hidden">
      {/* Left side - background image */}
      <div className="flex shrink-0 items-start justify-start h-full">
        <img
          src="/background.png"
          alt="Background"
          className="h-[58em] w-[30em] object-cover object-left overflow-hidden"
        />
      </div>

      {/* Right side - content */}
      <div className="flex flex-1 flex-col h-full items-center justify-center">
        <div className="flex flex-col items-center w-[28em]">
          {/* Logo */}
          <div className="flex justify-center mb-16">
            <img
              src="/journey-home-logo.png"
              alt="Journey Home"
              className="h-[6em] w-[22em]"
            />
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold font-family-roboto text-text-1 mb-6">
            Account Created
          </h1>

          {/* Message */}
          <p className="text-center font-family-roboto text-text-1 mb-12">
            Thanks for being a part of the Journey Home team!
          </p>

          {/* Back to Login button */}
          <button
            onClick={() => router.push("/")}
            className="w-full h-10 rounded-xs bg-primary text-white font-medium font-family-roboto"
          >
            Home
          </button>
        </div>
      </div>
    </div>
    </ProtectedRoute>
    
  );
}