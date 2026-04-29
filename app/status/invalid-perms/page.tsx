"use client";

import { StatusPage } from "@/components/general/StatusPage";
import { useAuth } from "@/contexts/AuthContext";

export default function InvalidPerms() {
    const { userData } = useAuth().state;
    const homePath = userData?.role === "Volunteer" ? "/donate" : "/";

    return (
        <StatusPage
            title="Insufficient Permissions"
            message="You don't have permissions to view this page"
            homePath={homePath}
        />
    );
}
