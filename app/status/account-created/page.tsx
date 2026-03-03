"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import { useRouter } from "next/navigation";

export default function AccountCreated() {
  const router = useRouter();

  return (
    <ProtectedRoute allow={["Admin", "Case Manager", "Volunteer"]}>
      <div className="bg-background flex h-full overflow-hidden">
        {/* Left side - background image - hidden on mobile */}
        <div className="hidden md:flex shrink-0 items-start justify-start h-full">
          <img
            src="/background.png"
            alt="Background"
            className="h-[58em] w-[30em] object-cover object-left overflow-hidden"
          />
        </div>

        {/* Right side - content */}
        <div className="flex flex-1 flex-col h-full items-center justify-center px-4 md:px-0">
          <div className="flex flex-col items-center w-full max-w-[28em]">
            {/* Logo */}
            <div className="flex justify-center mb-8 md:mb-16">
              <img
                src="/homes.png"
                alt="Journey Home"
                className="w-[220px] h-[58px] object-contain"
              />
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-bold font-family-roboto text-text-1 mb-6">
              Account Created
            </h1>

            {/* Message */}
            <p className="text-center font-family-roboto text-text-1 mb-12 px-8">
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
