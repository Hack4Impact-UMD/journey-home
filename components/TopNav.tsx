"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function TopNavbar() {

    let auth = useAuth();
    let router = useRouter();

    return (
        <div className="h-12 w-full border-b border-[#EFF3F5] flex items-center justify-end cursor-pointer"
            onClick={() => auth.logout().then(() => router.push("/login"))}
        >
            {auth.userData && <span className="font-family-opensans px-6">{auth.userData.firstName} {auth.userData.lastName}</span>}
        </div>
    )
}