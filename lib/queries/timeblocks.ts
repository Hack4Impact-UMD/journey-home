import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAllTB, setTB } from "../services/timeblocks";
import { TimeBlock } from "@/types/schedule";
import { toast } from "sonner";

export function useTBs() {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["timeblocks"],
        queryFn: fetchAllTB
    });

    const updateMutation = useMutation({
        mutationFn: async (newTB: TimeBlock) => {
            await setTB(newTB);
        },
        onMutate: async (newTB: TimeBlock) => {
            await queryClient.cancelQueries({ queryKey: ["timeblocks"] });
            const prevData = queryClient.getQueryData<TimeBlock[]>(["timeblocks"]);

            queryClient.setQueryData(["timeblocks"], (oldData: TimeBlock[] | undefined) => {
                if (!oldData) return [newTB];
                return oldData.map((TB) =>
                    TB.id === newTB.id ? newTB : TB,
                );
            });

            return { prevData };
        },
        onError: (error, newTB, context) => {
            if (context?.prevData) {
                queryClient.setQueryData(["timeblocks"], context.prevData);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["timeblocks"] });
        }
    });

    const updateTB = async (newTB: TimeBlock) => {
        const promise = updateMutation.mutateAsync(newTB);
        toast.promise(promise, {
            loading: "updating timeblock...",
            success: "timeblock modified successfully!",
            error: "error: couldn't update timeblock",
        });
        await promise.catch(() => {
            // Error surfaced via toast above; prevent unhandled rejection
        });
    };

    return {
        allTB: query.data ?? [],

        editTB: updateTB,

        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,

    };

}