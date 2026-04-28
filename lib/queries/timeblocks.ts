import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAllTB, setTB, signUpForShift } from "../services/timeblocks";
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
        onError: (error, newTB, context) => {
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
        signUpToast,

        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,

    };

}