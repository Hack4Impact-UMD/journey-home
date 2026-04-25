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
import { HandHeartIcon, HouseIcon, CalendarCheckIcon, PackageIcon } from "@phosphor-icons/react";

const CreateRequestIcon = () => <HandHeartIcon className="w-5 h-5" />;
const ShiftTasksIcon = () => <PackageIcon className="w-5 h-5" />;
const HomeIcon = () => <HouseIcon className="w-5 h-5" />;
const ShiftSignUpIcon = () => <CalendarCheckIcon className="w-5 h-5" />;


export default function Navbar({ pageTitle }: { pageTitle?: string }) {
    const auth = useAuth();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const navLinks = (isMobile: boolean) => (
        <>
            <NavbarLink
                icon={HomeIcon}
                name="Home"
                path="/"
                roles={[]}
                isMobile={isMobile}
                onClick={() => setDrawerOpen(false)}
            />
            <NavbarLink
                icon={InventoryIcon}
                name="Inventory"
                path="/inventory"
                roles={["Admin"]}
                isMobile={isMobile}
                onClick={() => setDrawerOpen(false)}
            />
            <NavbarLink
                icon={DonorRequestsIcon}
                name="Donor Requests"
                path="/donation-requests"
                roles={["Admin"]}
                isMobile={isMobile}
                onClick={() => setDrawerOpen(false)}
            />
            <NavbarLink
                icon={ClientRequestIcon}
                name="Client Requests"
                path="/client-requests"
                roles={["Admin"]}
                isMobile={isMobile}
                onClick={() => setDrawerOpen(false)}
            />
            <NavbarLink
                icon={PickupDeliveryIcon}
                name="Pickups & Deliveries"
                path="/pickups-deliveries"
                roles={["Admin"]}
                isMobile={isMobile}
                onClick={() => setDrawerOpen(false)}
            />
            <NavbarLink
                icon={UserManagementIcon}
                name="User Management"
                path="/user-management"
                roles={["Admin"]}
                isMobile={isMobile}
                onClick={() => setDrawerOpen(false)}
            />
            <NavbarLink
                icon={ControlPanelIcon}
                name="Control Panel"
                path="/control-panel"
                roles={["Admin"]}
                isMobile={isMobile}
                onClick={() => setDrawerOpen(false)}
            />
            <NavbarLink
                icon={CreateRequestIcon}
                name="Create Request"
                path="/client-request-form"
                roles={["Case Manager"]}
                isMobile={isMobile}
                onClick={() => setDrawerOpen(false)}
            />
            <NavbarLink
                icon={ShiftSignUpIcon}
                name="Shift Sign-Up"
                path="/volunteer-signup"
                roles={["Volunteer"]}
                isMobile={isMobile}
                onClick={() => setDrawerOpen(false)}
            />
            <NavbarLink
                icon={ShiftTasksIcon}
                name="Shift Tasks"
                path="/volunteer-tasks"
                roles={["Volunteer"]}
                isMobile={isMobile}
                onClick={() => setDrawerOpen(false)}
            />
            <NavbarLink
                name="Donation Form"
                path="/donate"
                roles={["Admin"]}
                isMobile={isMobile}
                onClick={() => setDrawerOpen(false)}
            />
        </>
    );

    return (
        <>
            {/* Desktop sidebar */}
            <div className="h-full w-[13em] shrink-0 flex flex-col font-family-roboto max-md:hidden">
                <Link href="/">
                    <div className="border border-[#EFF3F5] px-4 py-3">
                        <span className="text-primary font-family-raleway font-semibold text-xl">
                            Journey
                        </span>
                        <span className="text-secondary-1 font-family-raleway font-semibold text-xl">
                            Home
                        </span>
                    </div>
                </Link>
                <div className="px-4 py-2 h-full w-full flex flex-col">
                    {navLinks(false)}
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
            <div className={`hidden max-md:flex items-center pl-5.5 pr-4 pt-11.75 pb-4.25 bg-white border-b border-[#EFF3F5] font-family-roboto ${pageTitle ? "gap-2" : "justify-between"}`}>
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
                    <Link href="/" className="pr-5.5">
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
                inert={!drawerOpen ? true : undefined}
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
                    {navLinks(true)}
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
        </>
    );
}

function NavbarLink({
    name,
    path,
    roles,
    icon: Icon = ClientRequestIcon,
    isMobile = false,
    onClick,
}: {
    name: string;
    path: string;
    roles: UserRole[];
    icon?: React.FC;
    isMobile?: boolean;
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

    const isActive = path === "/" ? pathname === path : pathname?.startsWith(path);

    return (
        <Link
            href={path}
            onClick={onClick}
            className={`hover:text-primary flex items-center ${
                isMobile
                    ? `w-full h-10 px-4 gap-1 ${isActive ? "text-primary font-semibold" : ""}`
                    : `px-2 h-10 text-sm gap-2 rounded-[0.625rem] ${isActive ? "bg-[#F2FBFD] text-[#125C6D] font-semibold" : ""}`
            }`}
        >
            <span className="w-5 h-5 flex items-center justify-center shrink-0">
                <Icon />
            </span>
            {name}
        </Link>
    );
}
