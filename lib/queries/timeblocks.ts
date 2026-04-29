import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteTB, fetchAllTB, setTB, signUpForShift } from "../services/timeblocks";
import { clearDonationRequestTimeBlockRef } from "../services/donations";
import { clearClientRequestTimeBlockRef } from "../services/client-request";
import { TimeBlock } from "@/types/schedule";
import { toast } from "sonner";

export function useTimeBlocks() {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["timeblocks"],
        queryFn: fetchAllTB
    });

    const setMutation = useMutation({
        mutationFn: setTB,
        onMutate: async (newTB: TimeBlock) => {
            await queryClient.cancelQueries({ queryKey: ["timeblocks"] });
            const prevData = queryClient.getQueryData<TimeBlock[]>(["timeblocks"]);

            queryClient.setQueryData(["timeblocks"], (oldData: TimeBlock[] | undefined) => {
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
                queryClient.setQueryData(["timeblocks"], context.prevData);
            }
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
            await queryClient.cancelQueries({ queryKey: ["timeblocks"] });
            const prevData = queryClient.getQueryData<TimeBlock[]>(["timeblocks"]);
            queryClient.setQueryData(["timeblocks"], (old: TimeBlock[] | undefined) =>
                old ? old.filter(t => t.id !== tb.id) : []
            );
            return { prevData };
        },
        onError: (_err, _tb, context) => {
            if (context?.prevData) {
                queryClient.setQueryData(["timeblocks"], context.prevData);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["donationRequests"] });
            queryClient.invalidateQueries({ queryKey: ["clientRequests"] });
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
            queryClient.setQueryData(["timeblocks"], (old: TimeBlock[] | undefined) =>
                old ? old.map((tb) => tb.id === updatedTB.id ? updatedTB : tb) : [updatedTB]
            );
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