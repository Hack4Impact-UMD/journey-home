import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DonationRequest } from "@/types/donations";
import { getAllDonationRequests, setDonationRequest } from "../services/donations";
import { toast } from "sonner";

export function useDonationRequests() {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["donationRequests"],
        queryFn: getAllDonationRequests,
    });

    const setMutation = useMutation({
        mutationFn: setDonationRequest,
        onMutate: async (newDonationRequest: DonationRequest) => {
            await queryClient.cancelQueries({ queryKey: ["donationRequests"] });
            const prevData = queryClient.getQueryData<DonationRequest[]>(["donationRequests"]);

            queryClient.setQueryData(["donationRequests"], (oldData: DonationRequest[] | undefined) => {
                if (!oldData) return [newDonationRequest];

                if (oldData.find((dr) => dr.id === newDonationRequest.id)) {
                    return oldData.map((dr) =>
                        dr.id === newDonationRequest.id ? newDonationRequest : dr,
                    );
                }

                return oldData.concat([newDonationRequest]);
            });

            return { prevData };
        },
        onError: (error, newDonationRequest, context) => {
            if (context?.prevData) {
                queryClient.setQueryData(["donationRequests"], context.prevData);
            }
        },
    });

    const setDonationRequestToast = async (newDonationRequest: DonationRequest) => {
        const promise = setMutation.mutateAsync(newDonationRequest);
        toast.promise(promise, {
            loading: "Updating Donation Request...",
            success: "Donation Request updated successfully!",
            error: "Error: Couldn't update Donation Request",
        });
        await promise;
    };

    return {
        donationRequests: query.data ?? [],

        setDonationRequest: setMutation.mutateAsync,
        setDonationRequestToast,

        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
