import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAllWaivers, addWaiver } from "../services/waivers";
import { toast } from "sonner";

export function useWaivers() {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["waivers"],
        queryFn: fetchAllWaivers,
    });

    const addMutation = useMutation({
        mutationFn: addWaiver,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["waivers"] });
        },
    });

    const uploadWaiver = async (file: File) => {
        const promise = addMutation.mutateAsync(file);
        toast.promise(promise, {
            loading: "Updating waiver...",
            success: "Waiver updated successfully.",
            error: "Failed to update waiver.",
        });
        await promise;
    };

    return {
        waivers: query.data ?? [],
        activeWaiver: query.data?.find((w) => w.end === null) ?? null,
        currentWaiver: query.data?.find((w) => w.end === null) ?? null,
        uploadWaiver,
        isMutating: addMutation.isPending,
        isLoading: query.isLoading,
        isError: query.isError,
    };
}
