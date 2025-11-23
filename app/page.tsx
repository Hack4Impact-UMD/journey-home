"use client";

import SideNavbar from "@/components/SideNav";
import TopNavbar from "@/components/TopNav";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
    const auth = useAuth();
    const router = useRouter();

    const [message, setMessage] = useState<string>("Admin Homepage");

    useEffect(() => {
        if (auth.loading) {
            return;
        }
        console.log(auth);
        if (!auth.currentUser) {
            router.push("/login");
        } else if (auth.userData && auth.userData.pending) {
            setMessage("Pending " + auth.userData.pending);
        }
    }, [auth.userData, auth.loading]);

    return (
        <>
            <div className="h-full w-full flex flex-col font-family-roboto">
                <TopNavbar />
                <div className="flex flex-1">
                    <SideNavbar />
                    <div className="flex-1  bg-[#F7F7F7] py-4 px-6 flex flex-col">
                        <span className="text-2xl text-primary font-extrabold block">
                            Journeying to the Home Page!
                        </span>
                        <span className="pt-8">{message}</span>
                    </div>
                </div>
            </div>
        </>
    );
}
