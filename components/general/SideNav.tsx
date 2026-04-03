"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";
import Link from "next/link";
import { InventoryIcon } from "../icons/InventoryIcon";
import { DonorRequestsIcon } from "../icons/DonorRequestsIcon";
import { ClientRequestIcon } from "../icons/ClientRequestIcon";
import { PickupDeliveryIcon } from "../icons/PickupDeliveryIcon";
import { UserManagementIcon } from "../icons/UserManagementIcon";
import { ControlPanelIcon } from "../icons/ControlPanelIcon";
import { ViewIcon } from "../icons/ViewIcon";
import { Menu } from "lucide-react";

export default function SideNavbar({ pageTitle }: { pageTitle?: string }) {
    const auth = useAuth();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const navLinks = (
        <>
            <SideNavbarLink
                icon={InventoryIcon}
                name="Inventory"
                path="/inventory"
                roles={["Admin"]}
                onClick={() => setDrawerOpen(false)}
            />
            <SideNavbarLink
                icon={DonorRequestsIcon}
                name="Donor Requests"
                path="/donation-requests"
                roles={["Admin"]}
                onClick={() => setDrawerOpen(false)}
            />
            <SideNavbarLink
                icon={ClientRequestIcon}
                name="Client Requests"
                path="/client-requests"
                roles={["Admin", "Case Manager"]}
                onClick={() => setDrawerOpen(false)}
            />
            <SideNavbarLink
                icon={PickupDeliveryIcon}
                name="Pickups & Deliveries"
                path="/pickups-deliveries"
                roles={["Admin"]}
                onClick={() => setDrawerOpen(false)}
            />
            <SideNavbarLink
                icon={UserManagementIcon}
                name="User Management"
                path="/user-management"
                roles={["Admin"]}
                onClick={() => setDrawerOpen(false)}
            />
            <SideNavbarLink
                icon={ControlPanelIcon}
                name="Control Panel"
                path="/control-panel"
                roles={["Admin"]}
                onClick={() => setDrawerOpen(false)}
            />
            <SideNavbarLink
                name="Donation Form"
                path="/donate"
                roles={[]}
                onClick={() => setDrawerOpen(false)}
            />
        </>
    );

    return (
        <>
            {/* Desktop sidebar */}
            <div className="h-full w-[13em] flex flex-col font-family-roboto max-md:hidden">
                <Link href="/" className="pb-4">
                    <div className="border border-[#EFF3F5] px-4 py-3">
                        <span className="text-primary font-family-raleway font-semibold text-xl">
                            Journey
                        </span>
                        <span className="text-secondary-1 font-family-raleway font-semibold text-xl">
                            Home
                        </span>
                    </div>
                </Link>
                <div className="px-4 h-full w-full flex flex-col">
                    {navLinks}
                    <div className="mt-auto w-full mb-4">
                        <Link href="/profile">
                            <div className="pt-2 pb-2 pl-4 pr-2 border border-light-border rounded-lg w-full flex items-center justify-between">
                                <div>
                                    <div className="text-text-1 text-sm font-family-opensans">
                                        {auth.state.userData && (
                                            <>
                                                {auth.state.userData.firstName}{" "}
                                                {auth.state.userData.lastName}
                                            </>
                                        )}
                                    </div>
                                    <div className="text-xs font-family-opensans text-[#666666]">
                                        {auth.state.userData?.role ?? "Loading..."}
                                    </div>
                                </div>
                                <ViewIcon />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile top bar */}
            <div className={`hidden max-md:flex fixed top-0 left-0 right-0 z-50 items-center pl-5.5 pr-4 pt-11.75 pb-4.25 bg-white border-b border-[#EFF3F5] font-family-roboto ${pageTitle ? "gap-2" : "justify-between"}`}>
                <button
                    onClick={() => setDrawerOpen(true)}
                    className="px-0.5 text-text-1"
                    aria-label="Open menu"
                >
                    <Menu />
                </button>
                {pageTitle ? (
                    <span className="text-primary font-family-roboto font-bold text-[24px]">
                        {pageTitle}
                    </span>
                ) : (
                    <Link href="/" className="pr-6.25">
                        <span className="text-primary font-family-raleway font-light text-[16px]">
                            JOURNEY
                        </span>
                        <span className="text-secondary-1 font-family-raleway font-light text-[16px]">
                            HOME
                        </span>
                    </Link>
                )}
            </div>

            {/* Mobile drawer backdrop */}
            {drawerOpen && (
                <div
                    className="hidden max-md:block fixed inset-0 bg-black/40 z-50"
                    onClick={() => setDrawerOpen(false)}
                />
            )}

            {/* Mobile drawer */}
            <div
                className={`hidden max-md:flex fixed top-0 left-0 h-full w-63 z-50 bg-white flex-col transition-transform duration-300 ${
                    drawerOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex justify-center pt-12.5 pb-2.5 px-4 border-b border-[#EFF3F5]">
                    <Link href="/" onClick={() => setDrawerOpen(false)}>
                        <span className="text-primary font-family-raleway font-semibold text-[24px]">
                            Journey
                        </span>
                        <span className="text-secondary-1 font-family-raleway font-semibold text-[24px]">
                            Home
                        </span>
                    </Link>
                </div>
                <div className="pt-1 h-full flex flex-col">
                    {navLinks}
                    <div className="mt-auto w-full mb-10 px-4.75">
                        <Link href="/profile" onClick={() => setDrawerOpen(false)}>
                            <div className="pt-2 pb-2 pl-4 pr-2 border border-light-border rounded-lg w-full flex items-center justify-between">
                                <div>
                                    <div className="text-text-1 text-sm font-family-opensans">
                                        {auth.state.userData && (
                                            <>
                                                {auth.state.userData.firstName}{" "}
                                                {auth.state.userData.lastName}
                                            </>
                                        )}git
                                    </div>
                                    <div className="text-xs font-family-opensans text-[#666666]">
                                        {auth.state.userData?.role ?? "Loading..."}
                                    </div>
                                </div>
                                <ViewIcon />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

function SideNavbarLink({
    name,
    path,
    roles,
    icon: Icon = ClientRequestIcon,
    onClick,
}: {
    name: string;
    path: string;
    roles: UserRole[];
    icon?: React.FC;
    onClick?: () => void;
}) {
    const pathname = usePathname();
    const auth = useAuth();

    if (
        !auth.state.userData ||
        (roles.length > 0 && !roles.includes(auth.state.userData.role))
    ) {
        return <></>;
    }

    return (
        <Link
            href={path}
            onClick={onClick}
            className={`hover:text-primary w-full h-10 px-4 flex items-center gap-1 ${
                pathname?.startsWith(path) ? "text-primary font-semibold" : ""
            }`}
        >
            <div className="w-6 h-6 flex items-center justify-center shrink-0">
                <Icon />
            </div>
            <span className="font-family-roboto font-normal text-[16px]">{name}</span>
        </Link>
    );
}