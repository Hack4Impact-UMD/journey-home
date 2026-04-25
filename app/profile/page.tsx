"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import SideNavbar from "@/components/general/SideNav";
import PasswordResetSection from "@/components/profile/PasswordResetSection";
import { useAuth } from "@/contexts/AuthContext";
import { useAllActiveAccounts } from "@/lib/queries/users";
import { InventoryIcon } from "@/components/icons/InventoryIcon";
import { DonorRequestsIcon } from "@/components/icons/DonorRequestsIcon";
import { ClientRequestIcon } from "@/components/icons/ClientRequestIcon";
import { PickupDeliveryIcon } from "@/components/icons/PickupDeliveryIcon";
import { UserManagementIcon } from "@/components/icons/UserManagementIcon";
import { ControlPanelIcon } from "@/components/icons/ControlPanelIcon";
import { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { toast } from "sonner";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRole } from "@/types/user";
import React from "react";

type NavLink = {
    name: string;
    path: string;
    icon: React.FC;
    roles: UserRole[];
};

const ALL_NAV_LINKS: NavLink[] = [
    { name: "Inventory", path: "/inventory", icon: InventoryIcon, roles: ["Admin"] },
    { name: "Donor Requests", path: "/donation-requests", icon: DonorRequestsIcon, roles: ["Admin"] },
    { name: "Client Requests", path: "/client-requests", icon: ClientRequestIcon, roles: ["Admin", "Case Manager"] },
    { name: "Pickups & Deliveries", path: "/pickups-deliveries", icon: PickupDeliveryIcon, roles: ["Admin"] },
    { name: "User Management", path: "/user-management", icon: UserManagementIcon, roles: ["Admin"] },
    { name: "Control Panel", path: "/control-panel", icon: ControlPanelIcon, roles: ["Admin"] },
    { name: "Donation Form", path: "/donate", icon: ClientRequestIcon, roles: [] },
];

export default function ProfilePage() {
    const { state, logout } = useAuth();
    const currentUser = state.userData;
    const { allAccounts, editAccount, isLoading } = useAllActiveAccounts();
    const account = allAccounts.find((u) => u.uid === currentUser?.uid) ?? null;
    const pathname = usePathname();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dob, setDob] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [showPasswordReset, setShowPasswordReset] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
        if (phoneNumber && !/^\+?[\d\s()+-]+$/.test(phoneNumber)) {
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

    const role = state.userData?.role;
    const navLinks = ALL_NAV_LINKS.filter(
        (l) => l.roles.length === 0 || (role && l.roles.includes(role))
    );

    return (
        <ProtectedRoute allow={["Admin", "Case Manager", "Volunteer"]}>
            <div className="h-full w-full flex flex-col font-family-roboto">

                {/* Mobile top bar */}
                <div className="flex md:hidden items-center gap-2 px-[22px] py-[17px] bg-white border-b border-[#D9D9D9]">
                    <button
                        onClick={() => setMobileNavOpen(true)}
                        className="flex flex-col justify-center gap-[4.5px]"
                    >
                        <span className="block w-[18px] h-[2px] bg-black" />
                        <span className="block w-[18px] h-[2px] bg-black" />
                        <span className="block w-[18px] h-[2px] bg-black" />
                    </button>
                    <span className="text-2xl font-bold text-primary font-family-roboto">
                        Account info
                    </span>
                </div>

                {/* Mobile nav drawer */}
                {mobileNavOpen && (
                    <div className="fixed inset-0 z-50 flex md:hidden">
                        <div
                            className="absolute inset-0 bg-black/40"
                            onClick={() => setMobileNavOpen(false)}
                        />
                        <div className="relative z-10 w-[13em] h-full bg-white flex flex-col">
                            <Link href="/" onClick={() => setMobileNavOpen(false)}>
                                <div className="border border-[#EFF3F5] px-4 py-3">
                                    <span className="text-primary font-family-raleway font-semibold text-xl">Journey</span>
                                    <span className="text-secondary-1 font-family-raleway font-semibold text-xl">Home</span>
                                </div>
                            </Link>

                            <div className="px-4 flex-1 flex flex-col pt-2">
                                {navLinks.map((link) => {
                                    const Icon = link.icon;
                                    return (
                                        <Link
                                            key={link.path}
                                            href={link.path}
                                            onClick={() => setMobileNavOpen(false)}
                                            className={`hover:text-primary pb-4 text-sm flex items-center gap-2 ${
                                                pathname?.startsWith(link.path) ? "text-primary font-semibold" : ""
                                            }`}
                                        >
                                            <Icon />
                                            {link.name}
                                        </Link>
                                    );
                                })}

                                <div className="mt-auto w-full mb-4">
                                    <Link href="/profile" onClick={() => setMobileNavOpen(false)}>
                                        <div className="pt-2 pb-2 pl-4 pr-2 border border-light-border rounded-lg w-full flex items-center justify-between">
                                            <div>
                                                <div className="text-text-1 text-sm font-family-opensans">
                                                    {state.userData && (
                                                        <>{state.userData.firstName} {state.userData.lastName}</>
                                                    )}
                                                </div>
                                                <div className="text-xs font-family-opensans text-[#666666]">
                                                    {state.userData?.role ?? "Loading..."}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-1">
                    <SideNavbar />

                    <div className="flex-1 bg-[#F7F7F7] pt-8 pb-4 px-4 md:px-6 flex flex-col items-center justify-center">
                        {isLoading ? (
                            <p>Loading...</p>
                        ) : !account ? (
                            <p className="text-red-600">User not found</p>
                        ) : (
                            <div className="w-full max-w-3xl bg-white rounded-[0.625rem] border border-gray-300">
                                <div className="hidden md:block border-b border-light-border py-4 px-7">
                                    <h1 className="text-2xl text-primary font-bold mb-1">
                                        Account info
                                    </h1>
                                    <p className="text-[#666666]">{account.role}</p>
                                </div>

                                <div className="px-5 md:px-20 pt-6 pb-8">
                                    {showPasswordReset ? (
                                        <PasswordResetSection onBack={() => setShowPasswordReset(false)} />
                                    ) : (
                                        <>
                                            <h2 className="text-xl font-semibold mb-6">Personal</h2>
                                            <div className="space-y-7 mb-12">
                                                <div className="flex flex-col md:flex-row gap-4">
                                                    <div className="flex-1">
                                                        <label className="block mb-1 text-sm text-text-1">First name</label>
                                                        <input
                                                            type="text"
                                                            value={firstName}
                                                            onChange={(e) => setFirstName(e.target.value)}
                                                            className="w-full border border-gray-300 rounded-xs h-10 px-3"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="block mb-1 text-sm text-text-1">Last name</label>
                                                        <input
                                                            type="text"
                                                            value={lastName}
                                                            onChange={(e) => setLastName(e.target.value)}
                                                            className="w-full border border-gray-300 rounded-xs h-10 px-3"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row gap-4">
                                                    <div className="flex-1">
                                                        <label className="block mb-1 text-sm text-text-1">Phone number</label>
                                                        <input
                                                            type="tel"
                                                            value={phoneNumber}
                                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                                            className="w-full border border-gray-300 rounded-xs h-10 px-3"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="block mb-1 text-sm text-text-1">Date of birth</label>
                                                        <input
                                                            type="date"
                                                            value={dob}
                                                            onChange={(e) => setDob(e.target.value)}
                                                            className="w-full border border-gray-300 rounded-xs h-10 px-3"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <h2 className="text-xl font-semibold mb-6">Login</h2>
                                            <div className="flex flex-col gap-6 md:flex-row mb-16">
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
                                                        className="text-primary text-sm mt-4 text-right w-full hover:text-primary/80"
                                                    >
                                                        Change password
                                                    </button>
                                                </div>
                                            </div>

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
                                                        Cancel
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