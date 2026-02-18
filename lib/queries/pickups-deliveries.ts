import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DonationRequest } from "@/types/donations"
import { getAllDonationRequests, setDonationRequest } from "../services/donations";
import { ClientRequest } from "@/types/client-requests";
import { toast } from "sonner";
import { getAllClientRequest, setClientRequest } from "../services/client-request";

export function usePickups(search: string = "") {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["donationRequest", search],
        queryFn: async () => {
            const allDonationReqs = await getAllDonationRequests();

            const approvedOnly = allDonationReqs.filter(dr =>
                dr.items.some(item => item.status === "Approved")
            );

            if (!search) return approvedOnly;

            return approvedOnly.filter(dr => JSON.stringify(dr).toLowerCase().includes(search.toLowerCase()));
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (newDonationRequest: DonationRequest) => {
            await setDonationRequest(newDonationRequest);
        },
        onMutate: async (newDonationRequest: DonationRequest) => {
            await queryClient.cancelQueries({queryKey: ["donationRequest", search]});
            const prevData = queryClient.getQueryData<DonationRequest[]>(["donationRequest",search]);

            queryClient.setQueryData(["donationRequest", search], (oldData: DonationRequest[] | undefined) => {
                if (!oldData) return [newDonationRequest];
                return oldData.map((donationRequest) => 
                    donationRequest.id === newDonationRequest.id ? newDonationRequest : donationRequest,
                );
                
            });

            return {prevData};
        },
        onError: (error, newDonationRequest, context) => {
                if (context?.prevData) {
                    queryClient.setQueryData(["donationRequest", search], context.prevData);
                }
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["donationRequest", search] });
            }
        });
        const updateDonationRequest = async (newDonationRequest: DonationRequest) => {
            const promise = updateMutation.mutateAsync(newDonationRequest);
            toast.promise(promise, {
            loading: "Updating pickups...",
            success: "Pickup updated successfully!",
            error: "Error: Couldn't update pickup",
        });
        await promise;
    };
    return {
        pickups: query.data ?? [],
        editPickup: updateDonationRequest,

        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
export function useDeliveries(search: string = "") {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["clientRequests", search],
        queryFn: async () => {
            const requests = await getAllClientRequest();

            const approvedOnly = requests.filter(req => req.status === "Approved");
            if (!search) return approvedOnly;

            return approvedOnly.filter(req =>
                JSON.stringify(req).toLowerCase().includes(search.toLowerCase())
            );
        },
    });
    const updateMutation = useMutation({
        mutationFn: async (newClientRequest: ClientRequest) => {
            await setClientRequest(newClientRequest);
        },
        onMutate: async (newClientRequest: ClientRequest) => {
            await queryClient.cancelQueries({queryKey: ["clientRequest", search]});
            const prevData = queryClient.getQueryData<ClientRequest[]>(["clientRequest",search]);

            queryClient.setQueryData(["clientRequest", search], (oldData: ClientRequest[] | undefined) => {
                if (!oldData) return [newClientRequest];
                return oldData.map((clientRequest) => 
                    clientRequest.id === newClientRequest.id ? newClientRequest : clientRequest,
                );
                
            });

            return {prevData};
        },
        onError: (error, newClientRequest, context) => {
            if (context?.prevData) {
                queryClient.setQueryData(["clientRequest", search], context.prevData);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clientRequest", search] });
        }
        });
        const updateClientRequest = async (newClientRequest: ClientRequest) => {
            const promise = updateMutation.mutateAsync(newClientRequest);
            toast.promise(promise, {
            loading: "Updating deliveries...",
            success: "Deliveries updated successfully!",
            error: "Error: Couldn't update delivery",
        });
        await promise;
    };
    return {
        deliveries: query.data ?? [],
        editDelivery: updateClientRequest,

        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}