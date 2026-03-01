"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import SideNavbar from "@/components/general/SideNav";
import TopNavbar from "@/components/general/TopNav";
import ClientRequestsPage from "../page";
import { RequestDetailsPage } from "@/components/client-requests/RequestDetails";
import { getAllClientRequest } from "@/lib/services/client-request";
import { useClientRequests } from "@/lib/queries/client-requests";

export default function ClientRequestsAdminPage() {
    const { clientRequests, refetch: refetchClientRequests } = useClientRequests();
    return (
        <ProtectedRoute allow={["Admin"]}>
            <div className="h-full w-full flex flex-col font-family-roboto">
                <TopNavbar />
                <div className="flex flex-1">
                    <SideNavbar />
                    <div className="flex-1 bg-[#F7F7F7] py-4 px-6 flex flex-col">
                        <h1 className="text-2xl text-primary font-extrabold">
                            Client Requests (Admin)
                        </h1>
                        {clientRequests.map((client) => (
                            <RequestDetailsPage
                                key={client.id}
                                client={client}
                                userRole="Admin"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
