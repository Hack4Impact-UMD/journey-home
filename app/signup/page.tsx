"use client"
import { useState } from "react";
import PickRole from "./PickRole";
import SignUpInformation from "./SignUpInformation";
import { UserRole } from "@/types/user";

type Step = "pick" | "form";

export default function SignUpPage() {
  const [step, setStep] = useState<Step>("pick");
  const [role, setRole] = useState<UserRole>("Volunteer");

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="h-full max-w-[30em] overflow-hidden flex justify-center items-center">
        <img
          src="/background.png"
          alt="Login Background"
          className="object-cover min-h-full"
        />
      </div>

      {/* RIGHT column */}
      <div className="flex flex-1 flex-col h-full items-center justify-center">
        <div className="flex items-center justify-center">
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
    );
  }