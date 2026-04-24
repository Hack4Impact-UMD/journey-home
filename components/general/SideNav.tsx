"use client";
import React from "react";
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
import { HandHeartIcon, HouseIcon } from "@phosphor-icons/react";

const CreateRequestIcon = () => <HandHeartIcon className="w-5 h-5" />;
const HomeIcon = () => <HouseIcon className="w-5 h-5" />;

export default function SideNavbar() {
    const auth = useAuth();

    return (
        <div className="h-full w-[13em] flex flex-col font-family-roboto max-md:hidden">
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
                <SideNavbarLink
                    icon={HomeIcon}
                    name="Home"
                    path="/"
                    roles={[]}
                />

                <SideNavbarLink
                    icon={InventoryIcon}
                    name="Inventory"
                    path="/inventory"
                    roles={["Admin"]}
                />

                <SideNavbarLink
                    icon={DonorRequestsIcon}
                    name="Donor Requests"
                    path="/donation-requests"
                    roles={["Admin"]}
                />

                <SideNavbarLink
                    icon={ClientRequestIcon}
                    name="Client Requests"
                    path="/client-requests"
                    roles={["Admin"]}
                />

                <SideNavbarLink
                    icon={PickupDeliveryIcon}
                    name="Pickups & Deliveries"
                    path="/pickups-deliveries"
                    roles={["Admin"]}
                />

                <SideNavbarLink
                    icon={UserManagementIcon}
                    name="User Management"
                    path="/user-management"
                    roles={["Admin"]}
                />

                <SideNavbarLink
                    icon={ControlPanelIcon}
                    name="Control Panel"
                    path="/control-panel"
                    roles={["Admin"]}
                />

                <SideNavbarLink
                    icon={CreateRequestIcon}
                    name="Create Request"
                    path="/client-request-form"
                    roles={["Case Manager"]}
                />

                <SideNavbarLink
                    name="Donation Form"
                    path="/donate"
                    roles={["Admin"]}
                />

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
    );
}

function SideNavbarLink({
    name,
    path,
    roles,
    icon: Icon = ClientRequestIcon,
}: {
    name: string;
    path: string;
    roles: UserRole[];
    icon?: React.FC;
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
            className={`hover:text-primary px-2 h-10 text-sm flex items-center gap-2 rounded-[0.625rem] ${
                (path === "/" ? pathname === path : pathname?.startsWith(path)) ? "bg-[#F2FBFD] text-[#125C6D] font-semibold" : ""
            }`}
        >
            <span className="w-5 h-5 flex items-center justify-center shrink-0">
                <Icon />
            </span>
            {name}
        </Link>
    );
}
