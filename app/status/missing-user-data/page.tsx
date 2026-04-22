"use client";

import { DogSitIcon } from "@/components/icons/DogSitIcon";
import { useRouter } from "next/navigation";

export default function MissingUserData() {
    const router = useRouter();


    return (
        <>
            <div className="w-full h-full flex items-center justify-center flex-col gap-4 bg-[#ECFBFE]">
                <DogSitIcon />

                <h1 className="text-3xl text-text-2 pt-3">Page not found. </h1>

                <div className="flex items-center justify-center flex-col pt-3">
                    <p className="text-text-2">
                        Could not find data for this user
                    </p>
                    <div className="flex flex-row gap-4">
                        <button
                            className="border border-light-border px-3 py-1 rounded-lg font-family-roboto mt-[1rem] bg-background text-text-2"
                            onClick={() => router.push("/")}
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
