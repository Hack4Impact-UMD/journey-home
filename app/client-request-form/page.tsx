"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";

export default function ClientRequestFormPage() {
    return (
        <ProtectedRoute allow={["Case Manager"]}>
            <div className="h-full w-full bg-[#F7F7F7] py-4 px-6 flex flex-col font-family-roboto">
                <h1 className="text-2xl text-primary font-extrabold">
                    Client Request Form
                </h1>
            </div>
        </ProtectedRoute>
    );
}
