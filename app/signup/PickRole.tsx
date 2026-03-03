"use client";

import { UserRole } from "@/types/user";
import Link from "next/link";

export default function PickRole({
  role,
  setRole,
  onContinue,
}: {
  role: UserRole | null;
  setRole: (r: UserRole) => void;
  onContinue: () => void;
}) {
  return (
    <div className="w-full max-w-[28em] text-center px-4 mx-auto">
      {/* Logo */}
      <div className="flex justify-center mb-8 md:mb-16">
        <img src="/homes.png" alt="Journey Home" className="w-[220px] h-[58px] object-contain" />
      </div>
      <h1 className="text-xl md:text-2xl font-bold font-family-raleway text-text-1 mb-6">Account Type</h1>

      <div className="flex flex-col gap-4">
        {(["Admin","Case Manager","Volunteer"] as UserRole[]).map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={[
              "h-10 w-full rounded-xs border hover:cursor-pointer border-[#D9D9D9]",
              "px-5 text-text-1 text-center transition",
              role === r
                ? "shadow-md border-text-1"
                : "",
            ].join(" ")}
          >
            {r}
          </button>
        ))}
        <button
          onClick={onContinue}
          className="mt-6 h-10 w-full rounded-xs font-bold text-white bg-primary"
        >
          Continue
        </button>
      </div>

      <p className="mt-6 text-center font-family-opensans text-text-1">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold hover:underline" style={{ color: "var(--color-primary)" }}>
          Login
        </Link>
      </p>
    </div>
);
}