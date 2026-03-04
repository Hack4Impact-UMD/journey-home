"use client"
import { useState } from "react";
import PickRole from "./PickRole";
import SignUpInformation from "./SignUpInformation";
import { UserRole } from "@/types/user";
import MobileHeader from "@/components/auth/MobileHeader";

type Step = "pick" | "form";

export default function SignUpPage() {
  const [step, setStep] = useState<Step>("pick");
  const [role, setRole] = useState<UserRole>("Volunteer");

  return (
    <div className="flex h-screen overflow-hidden flex-col">
      <MobileHeader 
        backTo={step === "pick" ? "/login" : undefined}
        onBack={step === "form" ? () => setStep("pick") : undefined}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Background image - hidden on mobile */}
        <div className="hidden md:flex h-full max-w-[30em] overflow-hidden justify-center items-center">
          <img
            src="/background.png"
            alt="Login Background"
            className="object-cover min-h-full"
          />
        </div>

        {/* RIGHT column */}
        <div className="flex flex-1 flex-col h-full items-center justify-center px-4 md:px-0">
          <div className="flex items-center justify-center w-full max-w-[28em]">
            {step === "pick" ? (
              <PickRole
                role={role}
                setRole={setRole}
                onContinue={() => role && setStep("form")}
              />
            ) : (
              <SignUpInformation
                selectedRole={(role)}
                onBack={() => setStep("pick")}
              />
            )}
          </div>
        </div>
      </div>
    </div>  
  );
}
