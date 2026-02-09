"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";
import Link from "next/link";

export default function SideNavbar() {
    const pathname = usePathname();
    const auth = useAuth();

    return (
        <div className="h-full w-[12.5em] p-[1em] flex flex-col font-family-roboto">
            <Link href="/" className="text-primary font-extrabold pb-[1em]">
                {auth.state.userData?.role ?? "Loading..."}
            </Link>

            <SideNavbarLinkGroup
                name="Inventory"
                path="/inventory"
                roles={["Admin"]}
            >
                <SideNavbarLink
                    name="Warehouse"
                    path="/inventory/warehouse"
                    roles={["Admin"]}
                />
                <SideNavbarLink
                    name="Donation Requests"
                    path="/inventory/donation-requests"
                    roles={["Admin"]}
                />
                <SideNavbarLink
                    name="Reviewed Donations"
                    path="/inventory/reviewed-donations"
                    roles={["Admin"]}
                />
            </SideNavbarLinkGroup>

            <SideNavbarLinkGroup
                name="Pickups & deliveries"
                path="/pickups-deliveries"
                roles={["Admin"]}
            >
                <SideNavbarLink
                    name="Unscheduled"
                    path="/pickups-deliveries/unscheduled"
                    roles={["Admin"]}
                />
                <SideNavbarLink
                    name="Scheduled"
                    path="/pickups-deliveres/scheduled"
                    roles={["Admin"]}
                />
                <SideNavbarLink
                    name="Completed"
                    path="/pickups-deliveries/completed"
                    roles={["Admin"]}
                />
            </SideNavbarLinkGroup>
            
            <SideNavbarLink
                name="Donation Form"
                path="/donate"
                roles={[]}
            />

            <SideNavbarLinkGroup
                name="User Management"
                path="/user-management"
                roles={["Admin"]}
            >
                <SideNavbarLink
                    name="All Accounts"
                    path="/user-management/all-accounts"
                    roles={["Admin"]}
                />
                <SideNavbarLink
                    name="Account Requests"
                    path="/user-management/account-requests"
                    roles={["Admin"]}
                />
                <SideNavbarLink
                    name="Past Donors"
                    path="/user-management/past-donors"
                    roles={["Admin"]}
                />
            </SideNavbarLinkGroup>
            
            <SideNavbarLink
                name="Donation Form"
                path="/donate"
                roles={[]}
            />
        </div>
    );
}

function SideNavbarLinkGroup({
    name,
    path,
    roles,
    children,
}: {
    name: string;
    path: string;
    roles: UserRole[];
    children: React.ReactNode;
}) {
    const [groupOpen, setGroupOpen] = useState<boolean>(false);
    const pathname = usePathname();
    const auth = useAuth();

    useEffect(() => {
        if (pathname?.startsWith(path)) {
            setGroupOpen(true);
        }
    }, []);

    if (
        !auth.state.userData ||
        (roles.length > 0 && !roles.includes(auth.state.userData.role))
    ) {
        return <></>;
    }

    return (
        <div className="flex flex-col">
            <button
                onClick={() => setGroupOpen((x) => !x)}
                className={`text-left pb-4 text-sm flex items-center justify-between ${
                    pathname?.startsWith(path)
                        ? "text-primary font-semibold"
                        : ""
                }`}
            >
                <span>{name}</span>
                <span>{groupOpen ? "-" : "+"}</span>
            </button>
            {groupOpen && <div className="pl-6 flex flex-col">{children}</div>}
        </div>
    );
}

function SideNavbarLink({
    name,
    path,
    roles,
}: {
    name: string;
    path: string;
    roles: UserRole[];
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
            className={`hover:text-primary pb-3 text-sm ${
                pathname?.startsWith(path) ? "text-primary font-semibold" : ""
            }`}
        >
            {name}
        </Link>
    );
}
