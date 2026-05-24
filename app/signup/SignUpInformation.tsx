"use client";

import { useState } from "react";
import { UserRole } from "@/types/user";
import { useAuth } from "@/contexts/AuthContext";
import { authErrorMessage } from "@/lib/utils/auth-errors";
import Link from "next/link";
import { formatPhone } from "@/lib/utils/phone";

export default function SignUpInformation({
    selectedRole,
    onBack,
    onSuccess,
}: {
    selectedRole: UserRole;
    onBack: () => void;
    onSuccess: () => void;
}) {
    const [email, setEmail] = useState("");
    const [first, setFirst] = useState("");
    const [last, setLast] = useState("");
    const [phone, setPhone] = useState("");
    const [pw, setPw] = useState("");
    const [pw2, setPw2] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const auth = useAuth();

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);

        if (pw !== pw2) {
            setErr("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            await auth.signup(email, pw, first, last, phone, selectedRole);
            onSuccess();

        } catch (e: unknown) {
            console.error("Signup failed:", e);
            setErr(authErrorMessage(e));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div className="relative mb-4">
                <button onClick={onBack} className="hidden md:block absolute left-0 text-2xl">
                    ←
                </button>
                <h1 className="text-center text-2xl font-bold font-family-roboto text-text-1">
                    Create Account
                </h1>
            </div>

            <form onSubmit={onSubmit} className="w-full max-w-[28em]">
                <div className="flex gap-4">
                    <div>
                        <span className="text-sm">
                            First Name
                        </span>
                        <input
                            type="text"
                            value={first}
                            onChange={(e) => setFirst(e.target.value)}
                            className="rounded-xs border-[#D9D9D9] py-1.5 px-3 text-sm border w-full mt-2 mb-4"
                            required
                        />
                    </div>
                    <div>
                        <span className="text-sm">
                            Last Name
                        </span>
                        <input
                            type="text"
                            value={last}
                            onChange={(e) => setLast(e.target.value)}
                            className="rounded-xs border-[#D9D9D9] py-1.5 px-3 text-sm border w-full mt-2 mb-4"
                            required
                        />
                    </div>
                </div>

                <div>
                    <span className="text-sm">Phone Number</span>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => { e.target.setCustomValidity(""); setPhone(formatPhone(e.target.value)); }}
                        onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Please enter a complete phone number in the format 123-456-7890.")}
                        placeholder="XXX-XXX-XXXX"
                        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                        className="rounded-xs border-[#D9D9D9] py-1.5 px-3 text-sm border w-full mt-2 mb-4"
                        required
                    />
                </div>

                <span className="text-sm">
                    Email
                </span>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xs border-[#D9D9D9] py-1.5 px-3 text-sm border w-full mt-2 mb-4"
                    required
                />

                <span className="text-sm">
                    Password
                </span>
                <input
                    type="password"
                    value={pw}
                    onChange={(e) => { e.target.setCustomValidity(""); setPw(e.target.value); }}
                    onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Password must be at least 8 characters.")}
                    className="rounded-xs border-[#D9D9D9] py-1.5 px-3 text-sm border w-full mt-2 mb-4"
                    minLength={8}
                    required
                />

                <span className="text-sm">
                    Confirm Password
                </span>
                <input
                    type="password"
                    value={pw2}
                    onChange={(e) => { e.target.setCustomValidity(""); setPw2(e.target.value); }}
                    onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Password must be at least 8 characters.")}
                    className="rounded-xs border-[#D9D9D9] py-1.5 px-3 text-sm border w-full mt-2 mb-4"
                    minLength={8}
                    required
                />

                <div className="mt-6 flex justify-center mb-3 flex-col">
                    {err && <span className="text-red-500 text-center mb-2">{err}</span>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-10 rounded-xs bg-primary text-white"
                    >
                        {loading ? "Creating..." : "Create Account"}
                    </button>
                </div>

                <p className="text-center">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-semibold hover:underline"
                        style={{ color: "var(--color-primary)" }}
                    >
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}