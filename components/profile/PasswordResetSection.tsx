"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
} from "firebase/auth";
import { toast } from "sonner";

interface PasswordResetSectionProps {
    onBack: () => void;
}

export default function PasswordResetSection({ onBack }: PasswordResetSectionProps) {
    const { state } = useAuth();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSave = async () => {
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
            const credential = EmailAuthProvider.credential(
                state.currentUser.email,
                currentPassword,
            );
            await reauthenticateWithCredential(state.currentUser, credential);
            await updatePassword(state.currentUser, newPassword);

            toast.success("Password updated successfully!");
            onBack();
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
                throw error;
            }
        }
    };

    return (
        <>
            <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
            <div className="space-y-4 mb-12">
                <div>
                    <label className="block mb-1 text-sm text-text-1">Current Password</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-xs h-10 px-3"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm text-text-1">New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-xs h-10 px-3"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm text-text-1">Confirm New Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-xs h-10 px-3"
                    />
                </div>
            </div>
            <div className="flex gap-3 justify-end">
                <button
                    onClick={handleSave}
                    className="h-8 px-4 text-sm rounded-xs border border-primary bg-primary text-white cursor-pointer"
                >
                    Save
                </button>
                <button
                    onClick={onBack}
                    className="h-8 px-4 text-sm rounded-xs border border-gray-300 bg-white text-gray-700 cursor-pointer"
                >
                    Cancel
                </button>
            </div>
        </>
    );
}
