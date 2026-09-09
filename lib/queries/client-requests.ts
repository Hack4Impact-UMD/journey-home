import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClientRequest } from "@/types/client-requests";
import { getAllClientRequest, getClientRequestsByCaseManager, setClientRequest } from "../services/client-request";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useClientRequests() {
    const queryClient = useQueryClient();
    const { state } = useAuth();

    const uid = state.userData?.uid;
    const scopedToSelf = state.userData?.role === "Case Manager";
    const queryKey = ["clientRequests", scopedToSelf ? uid : "all"];

    const query = useQuery({
        queryKey,
        queryFn: () => (scopedToSelf ? getClientRequestsByCaseManager(uid!) : getAllClientRequest()),
        enabled: !state.loading && !!state.userData,
    });

    const setMutation = useMutation({
        mutationFn: setClientRequest,
        onMutate: async (newClientRequest: ClientRequest) => {
            await queryClient.cancelQueries({ queryKey });
            const prevData = queryClient.getQueryData<ClientRequest[]>(queryKey);

            queryClient.setQueryData(queryKey, (oldData: ClientRequest[] | undefined) => {
                if (!oldData) return [newClientRequest];

                if (oldData.find((cr) => cr.id === newClientRequest.id)) {
                    return oldData.map((cr) =>
                        cr.id === newClientRequest.id ? newClientRequest : cr,
                    );
                }

                return oldData.concat([newClientRequest]);
            });

            return { prevData };
        },
        onError: (error, newClientRequest, context) => {
            if (context?.prevData) {
                queryClient.setQueryData(queryKey, context.prevData);
            }
        },
    });

    const setClientRequestToast = async (newClientRequest: ClientRequest) => {
        const promise = setMutation.mutateAsync(newClientRequest);
        toast.promise(promise, {
            loading: "Updating Client Request...",
            success: "Client Request updated successfully!",
            error: "Error: Couldn't update client request",
        });
        await promise;
    };

    return {
        clientRequests: query.data ?? [],

        setClientRequest: setMutation.mutateAsync,
        setClientRequestToast,

        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
