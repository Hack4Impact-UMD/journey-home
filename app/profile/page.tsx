"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import SideNavbar from "@/components/general/SideNav";
import TopNavbar from "@/components/general/TopNav";
import { useAuth } from "@/contexts/AuthContext";
import { useAccount } from "@/lib/queries/users";
import { useEffect, useState } from "react";
import FormInput from "@/components/form/FormInput";
import Button from "@/components/form/Button";
import { Timestamp } from "firebase/firestore";
import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
} from "firebase/auth";
import { toast } from "sonner";

export default function ProfilePage() {
    const { state } = useAuth();
    const currentUser = state.userData;
    const { account, editAccount, isLoading } = useAccount(
        currentUser?.uid || "",
    );

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dob, setDob] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [showPasswordReset, setShowPasswordReset] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

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
            setPhoneNumber(account.phoneNumber || "");
        }
    }, [account]);

    if (isLoading) {
        return (
            <ProtectedRoute allow={["Admin", "Case Manager", "Volunteer"]}>
                <div className="h-full w-full flex flex-col font-family-roboto">
                    <TopNavbar />
                    <div className="flex flex-1">
                        <SideNavbar />
                        <div className="flex-1 bg-[#F7F7F7] py-4 px-6 flex flex-col">
                            <h1 className="text-2xl text-primary font-extrabold">
                                Profile
                            </h1>
                            <p>Loading...</p>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    if (!account) {
        return (
            <ProtectedRoute allow={["Admin", "Case Manager", "Volunteer"]}>
                <div className="h-full w-full flex flex-col font-family-roboto">
                    <TopNavbar />
                    <div className="flex flex-1">
                        <SideNavbar />
                        <div className="flex-1 bg-[#F7F7F7] py-4 px-6 flex flex-col">
                            <h1 className="text-2xl text-primary font-extrabold">
                                Profile
                            </h1>
                            <p className="text-red-600">User not found</p>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    /**
     * Validates and saves profile changes to Firestore
     * Performs validation on required fields and phone number format
     */
    const handleSave = async () => {
        // Validation
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

        try {
            // Convert date string to Firestore Timestamp
            const dobTimestamp = dob ? Timestamp.fromDate(new Date(dob)) : null;
            await editAccount({
                ...account,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                dob: dobTimestamp,
                phoneNumber: phoneNumber.trim(),
            });
        } catch {
            // Error already handled by toast.promise in editAccount
        }
    };

    /**
     * Reverts all form fields to their original values from the account data
     */
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
            setPhoneNumber(account.phoneNumber || "");
        }
    };

    /**
     * Handles password reset with validation and reauthentication
     * Validates password match, length, and current password before updating
     */
    const handlePasswordReset = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("New passwords don't match");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }
        if (!state.currentUser || !state.currentUser.email) {
            toast.error("No user logged in");
            return;
        }

        try {
            // Reauthenticate user with current password
            const credential = EmailAuthProvider.credential(
                state.currentUser.email,
                currentPassword,
            );
            await reauthenticateWithCredential(state.currentUser, credential);

            // Update password
            await updatePassword(state.currentUser, newPassword);

            toast.success("Password updated successfully!");
            resetPasswordForm();
        } catch (error: unknown) {
            const firebaseError = error as { code?: string };
            if (
                firebaseError.code === "auth/wrong-password" ||
                firebaseError.code === "auth/invalid-credential"
            ) {
                toast.error("Current password is incorrect");
            } else if (firebaseError.code === "auth/weak-password") {
                toast.error("New password is too weak");
            } else {
                toast.error("Error updating password");
            }
        }
    };

    /**
     * Clears password reset form and returns to profile view
     */
    const resetPasswordForm = () => {
        setShowPasswordReset(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    return (
        <ProtectedRoute allow={["Admin", "Case Manager", "Volunteer"]}>
            <div className="h-full w-full flex flex-col font-family-roboto">
                <TopNavbar />
                <div className="flex flex-1">
                    <SideNavbar />
                    <div className="flex-1 bg-[#F7F7F7] py-4 px-6 flex flex-col items-center">
                        <div className="w-full max-w-3xl bg-white rounded-[10px] border border-gray-300 p-8 shadow-sm">
                            {/* Header */}
                            <h1 className="text-2xl text-primary font-extrabold">
                                Account Info
                            </h1>
                            <p className="text-gray-700 mb-4">{account.role}</p>
                            <hr className="mb-6 -mx-8" />

                            {/* Conditional rendering: show profile form or password reset form */}
                            <div className="px-12">
                                {!showPasswordReset ? (
                                    <>
                                        {/* Personal Information Section */}
                                        <h2 className="text-xl font-semibold mb-6">
                                            Personal
                                        </h2>
                                        <div className="space-y-4 mb-6">
                                            <div className="flex gap-4">
                                                <FormInput
                                                    label="First Name"
                                                    value={firstName}
                                                    onChange={(e) =>
                                                        setFirstName(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="flex-1"
                                                />
                                                <FormInput
                                                    label="Last Name"
                                                    value={lastName}
                                                    onChange={(e) =>
                                                        setLastName(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="flex-1"
                                                />
                                            </div>
                                            <div className="flex gap-4">
                                                <FormInput
                                                    label="Date of Birth"
                                                    type="date"
                                                    value={dob}
                                                    onChange={(e) =>
                                                        setDob(e.target.value)
                                                    }
                                                    className="flex-1"
                                                />
                                                <FormInput
                                                    label="Phone Number"
                                                    type="tel"
                                                    value={phoneNumber}
                                                    onChange={(e) =>
                                                        setPhoneNumber(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="flex-1"
                                                />
                                            </div>
                                        </div>

                                        {/* Login Information Section */}
                                        <h2 className="text-xl font-semibold mb-6">
                                            Login
                                        </h2>
                                        <div className="space-y-4 mb-6">
                                            <div className="flex gap-4">
                                                <div className="flex-1">
                                                    <label className="block mb-2">
                                                        <span className="text-sm text-gray-700">
                                                            Email
                                                        </span>
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={account.email}
                                                        disabled
                                                        className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block mb-2">
                                                        <span className="text-sm text-gray-700">
                                                            Password
                                                        </span>
                                                    </label>
                                                    <input
                                                        type="password"
                                                        value="********"
                                                        disabled
                                                        className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                                                    />
                                                    <button
                                                        onClick={() =>
                                                            setShowPasswordReset(
                                                                true,
                                                            )
                                                        }
                                                        className="text-blue-600 text-sm mt-2 text-right w-full hover:text-blue-700"
                                                    >
                                                        Change Password
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Save Button */}
                                        <div className="flex gap-3 justify-end">
                                            <Button onClick={handleSave}>
                                                Save
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                onClick={handleCancel}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Reset Password Section */}
                                        <h2 className="text-xl font-semibold mb-6">
                                            Reset Password
                                        </h2>
                                        <div className="space-y-4 mb-6">
                                            <FormInput
                                                label="Current Password"
                                                type="password"
                                                value={currentPassword}
                                                onChange={(e) =>
                                                    setCurrentPassword(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <FormInput
                                                label="New Password"
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) =>
                                                    setNewPassword(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <FormInput
                                                label="Confirm New Password"
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) =>
                                                    setConfirmPassword(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex gap-3 justify-end">
                                            <Button
                                                onClick={handlePasswordReset}
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                onClick={resetPasswordForm}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
