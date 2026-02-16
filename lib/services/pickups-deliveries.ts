import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DonationItem, DonationRequest } from "@/types/donations"
import { getAllDonationRequests } from "./donations";
import { ClientRequest } from "@/types/client-requests";

export function getPickups() {
    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: ["donationRequests"],
        queryFn: async () => {
            const allDonationReqs = await getAllDonationRequests();
            return allDonationReqs.filter((donationRequest) =>
                donationRequest.items.some((item) => item.status === 'Approved')
            )
        },
    });  
    return query;
}
