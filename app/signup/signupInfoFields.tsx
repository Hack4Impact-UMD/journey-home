"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

type Role = "Administrator" | "Case Manager" | "Volunteer";

export default function SignUpInformation({
  selectedRole,
  onBack,
}: {
  selectedRole: Role;
  onBack: () => void;
}) {
  const [email, setEmail] = useState("");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [dob, setDob] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (pw !== pw2) {
      setErr("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      //create auth user
      const cred = await createUserWithEmailAndPassword(auth, email, pw);

      //set display name to be user's first and last name
      if (first || last) {
        await updateProfile(cred.user, { displayName: `${first} ${last}`.trim() });
      }

      //create firestore profile
      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        email,
        firstName: first,
        lastName: last,
        dateOfBirth: dob || null,
        role: selectedRole,
        createdAt: serverTimestamp(),
      });

      // INSERT - need to route to app dashboard or success screen (for now, account created alert)
      alert("Account created!");
    } catch (e: unknown) {
        console.error("Signup failed:", e);
        let msg = "Signup failed.";
        if (e instanceof Error) {
          msg = e.message;
        }
        alert(`Signup failed: ${msg}`);  
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-[620px]">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-[20px] px-2 mt-10">←</button>
        <h1 className="flex-1 text-center text-[24px] font-bold font-family-raleway text-text-1">Create Account</h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 font-family-opensans font-semibold">
        <Field label="Email *">
          <input
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full h-[48px] bg-white border border-text-1 rounded px-3"
            required
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="First Name *">
            <input
              type="text"
              value={first}
              onChange={(e)=>setFirst(e.target.value)}
              className="w-full h-[48px] bg-white border border-text-1 rounded px-3"
              required
            />
          </Field>
          <Field label="Last Name *">
            <input
              type="text"
              value={last}
              onChange={(e)=>setLast(e.target.value)}
              className="w-full h-[48px] bg-white border border-text-1 rounded px-3"
              required
            />
          </Field>
        </div>

        <Field label="Date of Birth">
          <input
            type="text"
            value={dob}
            onChange={(e)=>setDob(e.target.value)}
            placeholder="MM/DD/YYYY"
            inputMode="numeric"
            className="w-full h-[48px] bg-white border border-text-1 rounded px-3"
          />
        </Field>

        <Field label="Password *">
          <input
            type="password"
            value={pw}
            onChange={(e)=>setPw(e.target.value)}
            className="w-full h-[48px] bg-white border border-text-1 rounded px-3"
            required
          />
        </Field>

        <Field label="Confirm Password *">
          <input
            type="password"
            value={pw2}
            onChange={(e)=>setPw2(e.target.value)}
            className="w-full h-[48px] bg-white border border-text-1 rounded px-3"
            required
          />
        </Field>

        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[56px] rounded-[8px] font-semibold text-white"
            style={{ background: "var(--color-primary)" }}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </div>

        <p className="w-[514px] mx-auto text-center text-[16px]">
          Already have an account?{" "}
          <a href="/login" className="font-semibold hover:underline" style={{ color: "var(--color-primary)" }}>
            Login
          </a>
        </p>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-text-1">{label}</p>
      {children}
    </div>
  );
}
