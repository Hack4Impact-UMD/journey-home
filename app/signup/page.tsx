"use client"
import { useState } from "react";
import PickRole from "./PickRole";
import SignUpInformation from "./SignUpInformation";
import VerifyEmail from "./VerifyEmail";
import { UserRole } from "@/types/user";
import MobileTopBar from "@/components/auth/MobileTopBar";

type Step = "pick" | "form" | "verify";

export default function SignUpPage() {
  const [step, setStep] = useState<Step>("pick");
  const [role, setRole] = useState<UserRole>("Volunteer");

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <MobileTopBar />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:flex h-full max-w-[30em] overflow-hidden justify-center items-center">
          <img
            src="/background.png"
            alt="Login Background"
            className="object-cover min-h-full"
          />
        </div>

        {/* RIGHT column */}
        <div className="flex flex-1 flex-col h-full items-center justify-center" style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
        <div className="flex items-center justify-center">
          {step === "pick" ? (
            <PickRole
              role={role}
              setRole={setRole}
              onContinue={() => role && setStep("form")}
            />
          ) : step === "form" ? (
            <SignUpInformation
              selectedRole={(role)}
              onBack={() => setStep("pick")}
              onSuccess={() => setStep("verify")}
            />
          ) : (
            <VerifyEmail selectedRole={role} />
          )}
        </div>
      </div>
    </div>
    </div>  
    );
  }