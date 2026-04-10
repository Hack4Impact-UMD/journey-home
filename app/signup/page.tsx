"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import PickRole from "./PickRole";
import SignUpInformation from "./SignUpInformation";
import { UserRole } from "@/types/user";
import AuthMobileNavbar from "@/components/auth/AuthMobileNavbar";

type Step = "pick" | "form";

export default function SignUpPage() {
  const [step, setStep] = useState<Step>("pick");
  const [role, setRole] = useState<UserRole>("Volunteer");
  const router = useRouter();

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AuthMobileNavbar onBack={step === "pick" ? () => router.push("/login") : () => setStep("pick")} />

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
            ) : (
              <SignUpInformation
                selectedRole={role}
                onBack={() => setStep("pick")}
                onSuccess={() => router.push("/status/verify-email")}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
