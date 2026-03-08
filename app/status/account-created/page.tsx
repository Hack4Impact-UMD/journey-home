"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import { useRouter } from "next/navigation";
import MobileTopBar from "@/components/auth/MobileTopBar";

export default function AccountCreated() {
  const router = useRouter();

  return (
    <ProtectedRoute allow={["Admin", "Case Manager", "Volunteer"]}>
      <div className="bg-background flex flex-col h-full overflow-hidden">
        <MobileTopBar />
        
        <div className="flex flex-1 overflow-hidden">
          {/* Left side - background image */}
          <div className="hidden md:flex shrink-0 items-start justify-start h-full">
            <img
              src="/background.png"
              alt="Background"
              className="h-[58em] w-[30em] object-cover object-left overflow-hidden"
            />
          </div>

          {/* Right side - content */}
          <div className="flex flex-1 flex-col h-full items-center justify-center" style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
        <div className="flex flex-col items-center w-full max-w-[28em]">
          {/* Logo */}
          <div className="flex justify-center mb-16">
            <img
              src="/journey-home-logo.png"
              alt="Journey Home"
              className="hidden md:block h-[6em] w-[22em]"
            />
            <img
              src="/house-mobile-logo.png"
              alt="Journey Home"
              className="md:hidden w-full h-auto"
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
            Go to Dashboard
          </button>
          </div>
        </div>
      </div>
      </div>
    </ProtectedRoute>
    
  );
}