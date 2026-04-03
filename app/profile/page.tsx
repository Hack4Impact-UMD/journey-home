"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import SideNavbar from "@/components/general/SideNav";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
    const auth = useAuth();

    return (
        <ProtectedRoute allow={["Admin", "Case Manager", "Volunteer"]}>
            <div className="h-full w-full flex flex-col font-family-roboto">
                <div className="flex flex-1">
                    <SideNavbar pageTitle="Profile" />
                    <div className="flex-1 bg-[#F7F7F7] pt-8 max-md:pt-14 pb-4 px-6 flex flex-col">
                        <h1 className="text-2xl text-primary font-extrabold">
                            Profile
                        </h1>
                        <div className="mt-4">
                            <button
                                onClick={() => auth.logout()}
                                className="bg-primary text-white rounded-xs h-8 px-4 text-sm"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
