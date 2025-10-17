"use client";

type Role = "Administrator" | "Case Manager" | "Volunteer";

export default function PickRole({
  role,
  setRole,
  onContinue,
}: {
  role: Role | null;
  setRole: (r: Role) => void;
  onContinue: () => void;
}) {
  return (
    <div className="w-full md:w-[514px] text-center">
      {/* Logo */}
      <div className="flex justify-center mt-20 mb-15">
        <img src="/journey-home-logo.png" alt="Journey Home" className="h-[100px] w-[364px]" />
      </div>
      <h1 className="text-[24px] font-bold font-family-raleway text-text-1 mb-6">Account Type</h1>

      <div className="flex flex-col gap-4 font-family-opensans text-[18px]">
        {(["Administrator","Case Manager","Volunteer"] as Role[]).map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={[
              "h-[56px] w-full rounded-[8px] border",
              "px-4 text-text-1 text-center",
              role === r
                ? "bg-white border-text-1 border-1.5 shadow-sm"
                : "bg-white border-[#9e9e9e] hover:border-[#6b6b6b] transition",
            ].join(" ")}
          >
            {r}
          </button>
        ))}
        <button
          onClick={onContinue}
          className="mt-6 h-[56px] w-full rounded-[8px] font-bold text-white"
          style={{ background: "var(--color-primary)" }}
        >
          Continue
        </button>
      </div>

      <p className="mt-6 text-center text-[16px] font-family-opensans text-text-1">
        Already have an account?{" "}
        <a href="/login" className="font-semibold hover:underline" style={{ color: "var(--color-primary)" }}>
          Login
        </a>
      </p>
    </div>
);
}