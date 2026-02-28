"use client";
import { useEffect, useState} from "react";
import React from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";
import Link from "next/link";
import {InventoryIcon} from "../icons/InventoryIcon";
import { ClientRequestIcon } from "../icons/ClientRequestIcon";

export default function SideNavbar() {
    const auth = useAuth();

    return (
        <div className="h-full w-[12.5em] p-[1em] flex flex-col font-family-roboto">
            <Link href="/" className="text-primary font-extrabold pb-[1em]">
                {auth.state.userData?.role ?? "Loading..."}
            </Link>

            <SideNavbarLink
                icon = {InventoryIcon}
                name="Inventory"
                path="/inventory"
                roles={["Admin", "Volunteer"]}
            />

            <SideNavbarLink
                name="User Management"
                path="/user-management"
                roles={["Admin"]}
            />

            <SideNavbarLink
                icon = {ClientRequestIcon}
                name="Client Requests"
                path="/client-requests"
                roles={["Admin", "Case Manager"]}
            />

            <SideNavbarLink
                name="Pickups & Deliveries"
                path="/pickups-deliveries"
                roles={["Admin"]}
            />

            <SideNavbarLink
                name="Control Panel"
                path="/control-panel"
                roles={["Admin"]}
            />

            <SideNavbarLink
                name="Donation Form"
                path="/donate"
                roles={[]}
            />

            <SideNavbarLink
                name="Profile"
                path="/profile"
                roles={["Admin", "Case Manager", "Volunteer"]}
            />
        </div>
    );
}

function SideNavbarLink({
    name,
    path,
    roles,
    icon :Icon,
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
            className={`hover:text-primary pb-3 text-sm flex items-center gap-2 ${
                pathname?.startsWith(path) ? "text-primary font-semibold" : ""
            }`}
        >
            {Icon && <Icon />}
            {name}
        </Link>
    );
}
