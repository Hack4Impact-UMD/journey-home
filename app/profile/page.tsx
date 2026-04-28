"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import Navbar from "@/components/general/Navbar";
import PasswordResetSection from "@/components/profile/PasswordResetSection";
import { useAuth } from "@/contexts/AuthContext";
import { useAllActiveAccounts } from "@/lib/queries/users";
import { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { toast } from "sonner";

export default function ProfilePage() {
    const { state, logout } = useAuth();
    const currentUser = state.userData;
    const { allAccounts, editAccount, isLoading } = useAllActiveAccounts();
    const account = allAccounts.find((u) => u.uid === currentUser?.uid) ?? null;

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dob, setDob] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [showPasswordReset, setShowPasswordReset] = useState(false);

    useEffect(() => {
        if (account) {
            setFirstName(account.firstName || "");
            setLastName(account.lastName || "");
            if (account.dob) {
                const date = new Date(account.dob.seconds * 1000);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                setDob(`${year}-${month}-${day}`);
            } else {
                setDob("");
            }
            setPhoneNumber(account.phone || "");
        }
    }, [account]);

    const handleSave = async () => {
        if (!firstName.trim()) {
            toast.error("First name is required");
            return;
        }
        if (!lastName.trim()) {
            toast.error("Last name is required");
            return;
        }
        if (phoneNumber && !/^\+?[\d\s\-()]+$/.test(phoneNumber)) {
            toast.error("Invalid phone number format");
            return;
        }

        if (!account) return;

        let dobTimestamp: Timestamp | null = null;
        if (dob) {
            const [y, m, d] = dob.split("-").map(Number);
            dobTimestamp = Timestamp.fromDate(new Date(y, m - 1, d, 12, 0, 0));
        }

        await editAccount({
            ...account,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            dob: dobTimestamp,
            phone: phoneNumber.trim(),
        });
    };

    const handleCancel = () => {
        if (account) {
            setFirstName(account.firstName || "");
            setLastName(account.lastName || "");
            if (account.dob) {
                const date = new Date(account.dob.seconds * 1000);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                setDob(`${year}-${month}-${day}`);
            } else {
                setDob("");
            }
            setPhoneNumber(account.phone || "");
        }
    };

    return (
        <ProtectedRoute allow={["Admin", "Case Manager", "Volunteer"]}>
            <div className="h-full w-full flex flex-col font-family-roboto overflow-hidden">
                <div className="flex flex-1 min-h-0 max-md:flex-col">
                    <Navbar pageTitle="Profile" />
                    <div className="flex-1 min-h-0 bg-[#F7F7F7] pt-8 max-md:pt-1 pb-4 px-6 flex flex-col items-center justify-center">
                        {isLoading ? (
                            <p>Loading...</p>
                        ) : !account ? (
                            <p className="text-red-600">User not found</p>
                        ) : (
                            <div className="w-full max-w-3xl bg-white rounded-[0.625rem] border border-gray-300">
                                <div className="border-b border-light-border py-4 px-7">
                                    <h1 className="text-2xl text-primary font-bold mb-1">
                                        Account Info
                                    </h1>
                                    <p className="text-[#666666]">{account.role}</p>
                                </div>

                                <div className="px-20 pt-6 pb-8">
                                {showPasswordReset ? (
                                    <PasswordResetSection onBack={() => setShowPasswordReset(false)} />
                                ) : (
                                    <>
                                    {/* Personal Information Section */}
                                    <h2 className="text-xl font-semibold mb-4">
                                        Personal
                                    </h2>
                                    <div className="space-y-4 mb-8">
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="block mb-1 text-sm text-text-1">First Name</label>
                                                <input
                                                    type="text"
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                    className="w-full border border-gray-300 rounded-xs h-10 px-3"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block mb-1 text-sm text-text-1">Last Name</label>
                                                <input
                                                    type="text"
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                    className="w-full border border-gray-300 rounded-xs h-10 px-3"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="block mb-1 text-sm text-text-1">Date of Birth</label>
                                                <input
                                                    type="date"
                                                    value={dob}
                                                    onChange={(e) => setDob(e.target.value)}
                                                    className="w-full border border-gray-300 rounded-xs h-10 px-3"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block mb-1 text-sm text-text-1">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    value={phoneNumber}
                                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                                    className="w-full border border-gray-300 rounded-xs h-10 px-3"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Login Information Section */}
                                    <h2 className="text-xl font-semibold mb-4">
                                        Login
                                    </h2>
                                    <div className="flex gap-4 mb-16">
                                        <div className="flex-1">
                                            <label className="block mb-1 text-sm text-text-1">Email</label>
                                            <input
                                                type="email"
                                                value={account.email}
                                                disabled
                                                className="w-full border border-gray-300 rounded-xs h-10 px-3 bg-gray-100 text-gray-500 cursor-not-allowed"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block mb-1 text-sm text-text-1">Password</label>
                                            <input
                                                type="password"
                                                value="********"
                                                disabled
                                                className="w-full border border-gray-300 rounded-xs h-10 px-3 bg-gray-100 text-gray-500 cursor-not-allowed"
                                            />
                                            <button
                                                onClick={() => setShowPasswordReset(true)}
                                                className="text-primary text-sm mt-2 text-right w-full hover:text-primary/80"
                                            >
                                                Change Password
                                            </button>
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex justify-between items-center">
                                        <button
                                            onClick={logout}
                                            className="text-red-600 text-sm hover:text-red-700"
                                        >
                                            Log Out
                                        </button>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleSave}
                                                className="h-8 px-4 text-sm rounded-xs border border-primary bg-primary text-white cursor-pointer"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="h-8 px-4 text-sm rounded-xs border border-gray-300 bg-white text-gray-700 cursor-pointer"
                                            >
                                                Reset
                                            </button>
                                        </div>
                                    </div>
                                    </>
                                )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
