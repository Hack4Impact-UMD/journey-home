"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";
import Link from "next/link";
import { InventoryIcon } from "@/components/icons/InventoryIcon";
import { DonorRequestsIcon } from "@/components/icons/DonorRequestsIcon";
import { ClientRequestIcon } from "@/components/icons/ClientRequestIcon";
import { PickupDeliveryIcon } from "@/components/icons/PickupDeliveryIcon";
import { UserManagementIcon } from "@/components/icons/UserManagementIcon";
import { ControlPanelIcon } from "@/components/icons/ControlPanelIcon";
// import { ViewIcon } from "@/components/icons/ViewIcon";
import { AdminCalendarPeople } from "@/components/icons/AdminCalendarPeople";
import { DogPeekingIcon } from "../icons/DogPeekingIcon";

export default function SideNavbar() {
    const auth = useAuth();

    return (
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
                    roles={["Admin", "Case Manager"]}
                />

                <SideNavbarLink
                    icon={PickupDeliveryIcon}
                    name="Pickups & Deliveries"
                    path="/pickups-deliveries"
                    roles={["Admin"]}
                />

                <SideNavbarLink
                    icon={AdminCalendarPeople}
                    name="Schedule"
                    path="/schedule"
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
                    name="Donation Form"
                    path="/donate"
                    roles={[]}
                />

                <div className="mt-auto w-full mb-4">
                    <Link href="/profile/settings">
                        <div className="relative pt-2 pl-4 pr-2 border border-light-border rounded-lg w-full flex items-center justify-between">
                            <div className = "pb-2">
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
                            <div className = "absolute bottom-0 right-2 translate-y-[0.0625rem]">
                                <DogPeekingIcon/>
                            </div>
                            {/* <ViewIcon /> */}
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
            className={`hover:text-primary pb-4 text-sm flex items-center gap-2 ${
                pathname?.startsWith(path) ? "text-primary font-semibold" : ""
            }`}
        >
            <Icon />
            {name}
        </Link>
    );
}
