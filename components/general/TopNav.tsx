"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function TopNavbar() {
    const auth = useAuth();

    return (
        <div
            className="h-12 w-full border-b border-[#EFF3F5] flex items-center justify-end cursor-pointer"
            onClick={() => auth.logout()}
        >
            <img
                src="/DefaultProfilePicture.png"
                alt="default"
                className="h-6 w-6 rounded-full"
            />
            {auth.state.userData && (
                <span className="font-family-opensans ml-3 mr-6">
                    {auth.state.userData.firstName}{" "}
                    {auth.state.userData.lastName}
                </span>
            )}
        </div>
    );
}
