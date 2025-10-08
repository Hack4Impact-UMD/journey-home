"use client"
import { useState } from "react";
import PickRole from "./chooseRole";
import SignUpInformation from "./signupInfoFields";

type Role = "Administrator" | "Case Manager" | "Volunteer";
type Step = "pick" | "form";

export default function SignUpPage() {
  const [step, setStep] = useState<Step>("pick");
  const [role, setRole] = useState<Role | null>("Administrator");

  return (
    <div className="min-h-screen bg-background flex">
      {/* image on the left */}
      <div className="flex shrink-0 items-start justify-start">
        <img
          src="/background.png"
          alt="Login Background"
          className="h-[843px] w-[492px] object-cover object-left"
        />
      </div>

      {/* RIGHT column */}
      <div className="flex flex-1 flex-col px-6 py-10">
        <div className="flex-1 flex items-start justify-center">
          {step === "pick" ? (
            <PickRole
              role={role}
              setRole={setRole}
              onContinue={() => role && setStep("form")}
            />
          ) : (
            <SignUpInformation
              selectedRole={(role ?? "Administrator")}
              onBack={() => setStep("pick")}
            />
          )}
        </div>
      </div>
    </div>  
    );
  }