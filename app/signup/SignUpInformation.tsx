"use client";

import { useState } from "react";
import { UserRole } from "@/types/user";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function SignUpInformation({
    selectedRole,
    onBack,
}: {
    selectedRole: UserRole;
    onBack: () => void;
}) {
    const [email, setEmail] = useState("");
    const [first, setFirst] = useState("");
    const [last, setLast] = useState("");
    const [dob, setDob] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [phoneExt, setPhoneExt] = useState("");
    const [pw, setPw] = useState("");
    const [pw2, setPw2] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const router = useRouter();
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

            await auth.signup(email, pw, first, last, dob, selectedRole);
            router.push("/verify-email");

        } catch (e: unknown) {
            console.error("Signup failed:", e);
            setErr((e as FirebaseError).message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full px-4">
            <div className="relative mb-9 hidden md:block">
                <button onClick={onBack} className="absolute left-0 text-2xl">
                    ←
                </button>
                <h1 className="text-center text-xl md:text-2xl font-bold font-family-roboto text-text-1">
                    Create Account
                </h1>
            </div>
            <h1 className="md:hidden text-center text-xl font-bold font-family-roboto text-text-1 mb-9">
                Create Account
            </h1>

            <form onSubmit={onSubmit} className="w-full max-w-[28em] mx-auto">
                <div className="flex gap-4">
                    <div>
                        <span className="text-sm">
                            <span className="text-red-500">*</span> First Name
                        </span>
                        <input
                            type="text"
                            value={first}
                            onChange={(e) => setFirst(e.target.value)}
                            className="rounded-xs border-[#D9D9D9] py-1.5 px-3 text-sm border w-full mt-2 mb-6"
                            required
                        />
                    </div>
                    <div>
                        <span className="text-sm">
                            <span className="text-red-500">*</span> Last Name
                        </span>
                        <input
                            type="text"
                            value={last}
                            onChange={(e) => setLast(e.target.value)}
                            className="rounded-xs border-[#D9D9D9] py-1.5 px-3 text-sm border w-full mt-2 mb-6"
                            required
                        />
                    </div>
                </div>

                <span className="text-sm">Date of Birth</span>
                <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="rounded-xs border-[#D9D9D9] py-1.5 px-3 text-sm border w-full mt-2 mb-6"
                />

                <span className="text-sm">Phone Number</span>
                <div className="flex gap-2 mt-2 mb-6">
                    <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="(123) 456-7890"
                        className="rounded-xs border-[#D9D9D9] py-1.5 px-3 text-sm border flex-1"
                    />
                    <input
                        type="text"
                        value={phoneExt}
                        onChange={(e) => setPhoneExt(e.target.value)}
                        placeholder="Ext"
                        className="rounded-xs border-[#D9D9D9] py-1.5 px-3 text-sm border w-20"
                    />
                </div>

                <span className="text-sm">
                    <span className="text-red-500">*</span> Email
                </span>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xs border-[#D9D9D9] py-1.5 px-3 text-sm border w-full mt-2 mb-6"
                    required
                />

                <span className="text-sm">
                    <span className="text-red-500">*</span> Password
                </span>
                <input
                    type="password"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    className="rounded-xs border-[#D9D9D9] py-1.5 px-3 text-sm border w-full mt-2 mb-6"
                    required
                />

                <span className="text-sm">
                    <span className="text-red-500">*</span> Confirm Password
                </span>
                <input
                    type="password"
                    value={pw2}
                    onChange={(e) => setPw2(e.target.value)}
                    className="rounded-xs border-[#D9D9D9] py-1.5 px-3 text-sm border w-full mt-2 mb-6"
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