"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

export default function SideNavbar() {
    const pathname = usePathname();
    const [inventoryOpen, setInventoryOpen] = useState(pathname?.startsWith("/inventory") || false);
    const [userManagementOpen, setUserManagementOpen] = useState(pathname?.startsWith("/user-management") || false);

    return (
        <div className="h-full w-[12.5em] p-[1em] flex flex-col font-family-roboto">
            <span className="text-primary font-extrabold pb-[1em]">Admin</span>
            
            <div className="flex flex-col">
                <button
                    onClick={() => setInventoryOpen(!inventoryOpen)}
                    className={`text-left pb-[1em] text-sm flex items-center justify-between ${
                        pathname?.startsWith("/inventory") ? "text-primary font-semibold" : ""
                    }`}
                >
                    <span>Inventory</span>
                    <span>{inventoryOpen ? "−" : "+"}</span>
                </button>
                {inventoryOpen && (
                    <div className="pl-[1em] flex flex-col">
                        <a
                            href="/inventory/warehouse"
                            className={`pb-[0.75em] text-sm ${
                                pathname === "/inventory/warehouse" ? "text-primary font-semibold" : ""
                            }`}
                        >
                            Warehouse
                        </a>
                        <a
                            href="/inventory/donation-requests"
                            className={`pb-[0.75em] text-sm ${
                                pathname === "/inventory/donation-requests" ? "text-primary font-semibold" : ""
                            }`}
                        >
                            Donation Requests
                        </a>
                        <a
                            href="/inventory/approved-donations"
                            className={`pb-[0.75em] text-sm ${
                                pathname === "/inventory/approved-donations" ? "text-primary font-semibold" : ""
                            }`}
                        >
                            Approved Donations
                        </a>
                        <a
                            href="/inventory/denied-donations"
                            className={`pb-[0.75em] text-sm ${
                                pathname === "/inventory/denied-donations" ? "text-primary font-semibold" : ""
                            }`}
                        >
                            Denied Donations
                        </a>
                    </div>
                )}
            </div>

            <a
                href="/volunteers"
                className={`pb-[1em] text-sm ${
                    pathname?.startsWith("/volunteers") ? "text-primary font-semibold" : ""
                }`}
            >
                Volunteers
            </a>
            
            <a
                href="/case-managers"
                className={`pb-[1em] text-sm ${
                    pathname?.startsWith("/case-managers") ? "text-primary font-semibold" : ""
                }`}
            >
                Case Managers
            </a>

            <div className="flex flex-col">
                <button
                    onClick={() => setUserManagementOpen(!userManagementOpen)}
                    className={`text-left pb-[1em] text-sm flex items-center justify-between ${
                        pathname?.startsWith("/user-management") ? "text-primary font-semibold" : ""
                    }`}
                >
                    <span>User Management</span>
                    <span>{userManagementOpen ? "−" : "+"}</span>
                </button>
                {userManagementOpen && (
                    <div className="pl-[1em] flex flex-col">
                        <a
                            href="/user-management/all-accounts"
                            className={`pb-[0.75em] text-sm ${
                                pathname?.startsWith("/user-management/all-accounts") || pathname === "/user-management"
                                    ? "text-primary font-semibold" 
                                    : ""
                            }`}
                        >
                            All Accounts
                        </a>
                        <a
                            href="/user-management/previous-donors"
                            className={`pb-[0.75em] text-sm ${
                                pathname?.startsWith("/user-management/previous-donors")
                                    ? "text-primary font-semibold" 
                                    : ""
                            }`}
                        >
                            Previous donors
                        </a>
                        <a
                            href="/user-management/account-requests"
                            className={`pb-[0.75em] text-sm ${
                                pathname?.startsWith("/user-management/account-requests")
                                    ? "text-primary font-semibold" 
                                    : ""
                            }`}
                        >
                            Account requests
                        </a>
                    </div>
                )}
            </div>
        </div>
    )
}