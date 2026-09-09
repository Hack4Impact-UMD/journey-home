import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteTB, fetchAllTB, fetchPublicTB, setTB, signUpForShift } from "../services/timeblocks";
import { clearDonationRequestTimeBlockRef } from "../services/donations";
import { clearClientRequestTimeBlockRef } from "../services/client-request";
import { TimeBlock } from "@/types/schedule";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useTimeBlocks(options?: { enabled?: boolean }) {
    const queryClient = useQueryClient();
    const { state } = useAuth();

    const publishedOnly = state.userData?.role !== "Admin";
    const queryKey = ["timeblocks", publishedOnly];

    const query = useQuery({
        queryKey,
        queryFn: () => fetchAllTB(publishedOnly),
        enabled: (options?.enabled ?? true) && !state.loading && !!state.userData,
    });

    const setMutation = useMutation({
        mutationFn: setTB,
        onMutate: async (newTB: TimeBlock) => {
            await queryClient.cancelQueries({ queryKey });
            const prevData = queryClient.getQueryData<TimeBlock[]>(queryKey);

            queryClient.setQueryData(queryKey, (oldData: TimeBlock[] | undefined) => {
                if (!oldData) return [newTB];

                if(oldData.find((TB) => TB.id === newTB.id)) {
                    return oldData.map((TB) =>
                        TB.id === newTB.id ? newTB : TB,
                    );
                }

                return oldData.concat([newTB,]);
            });

            return { prevData };
        },
        onError: (_error, _newTB, context) => {
            if (context?.prevData) {
                queryClient.setQueryData(queryKey, context.prevData);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["timeblocks-public"] });
        },
    });

    const setTimeblockToast = async (newTB: TimeBlock) => {
        const promise = setMutation.mutateAsync(newTB);
        toast.promise(promise, {
            loading: "Setting Timeblock...",
            success: "Timeblock set successfully!",
            error: "Error: Couldn't update timeblock",
        });

        await promise;
    };

    const deleteMutation = useMutation({
        mutationFn: async (tb: TimeBlock) => {
            await Promise.all(
                tb.tasks.map(task =>
                    "donor" in task
                        ? clearDonationRequestTimeBlockRef(task.id)
                        : clearClientRequestTimeBlockRef(task.id)
                )
            );
            await deleteTB(tb.id);
        },
        onMutate: async (tb: TimeBlock) => {
            await queryClient.cancelQueries({ queryKey });
            const prevData = queryClient.getQueryData<TimeBlock[]>(queryKey);
            queryClient.setQueryData(queryKey, (old: TimeBlock[] | undefined) =>
                old ? old.filter(t => t.id !== tb.id) : []
            );
            return { prevData };
        },
        onError: (_err, _tb, context) => {
            if (context?.prevData) {
                queryClient.setQueryData(queryKey, context.prevData);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["donationRequests"] });
            queryClient.invalidateQueries({ queryKey: ["clientRequests"] });
            queryClient.invalidateQueries({ queryKey: ["timeblocks-public"] });
        },
    });

    const deleteTimeblockToast = async (tb: TimeBlock) => {
        const promise = deleteMutation.mutateAsync(tb);
        toast.promise(promise, {
            loading: "Deleting shift...",
            success: "Shift deleted!",
            error: "Couldn't delete shift",
        });
        await promise;
    };

    const signUpToast = async (tbId: string, groupName: string, userId: string) => {
        const toastId = toast.loading("Signing up...");
        try {
            const updatedTB = await signUpForShift(tbId, groupName, userId);
            toast.success("Signed up successfully!", { id: toastId });
            queryClient.setQueryData(queryKey, (old: TimeBlock[] | undefined) =>
                old ? old.map((tb) => tb.id === updatedTB.id ? updatedTB : tb) : [updatedTB]
            );
            queryClient.invalidateQueries({ queryKey: ["timeblocks-public"] });
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Couldn't sign up for shift", { id: toastId });
        }
    };

    return {
        allTB: query.data ?? [],

        setTimeblockToast: setTimeblockToast,
        setTimeblock: setMutation.mutateAsync,
        deleteTimeblockToast,
        signUpToast,

        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,

    };

}

// PII-free projection used by the public /volunteer page.
export function usePublicTimeBlocks(options?: { enabled?: boolean }) {
    const query = useQuery({
        queryKey: ["timeblocks-public"],
        queryFn: fetchPublicTB,
        enabled: options?.enabled ?? true,
    });

    return {
        publicTB: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
    };
}
