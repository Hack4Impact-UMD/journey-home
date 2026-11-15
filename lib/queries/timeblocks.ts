import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteTB, dropShift, fetchAllTB, fetchPublicTB, fetchVolunteerTB, setTB, signUpForShift } from "../services/timeblocks";
import { clearDonationRequestTimeBlockRef } from "../services/donations";
import { clearClientRequestTimeBlockRef } from "../services/client-request";
import { TimeBlock } from "@/types/schedule";
import { useAuth } from "@/contexts/AuthContext";
import { isActiveVolunteer } from "@/lib/utils/account";
import { writeErrorMessage } from "@/lib/utils/firebase-errors";
import { toast } from "sonner";

// Admin-only: every shift, drafts and tasks included. Volunteers use
// useVolunteerTimeBlocks and visitors usePublicTimeBlocks.
export function useTimeBlocks() {
    const queryClient = useQueryClient();
    const { state } = useAuth();

    const queryKey = ["timeblocks"];

    const query = useQuery({
        queryKey,
        queryFn: fetchAllTB,
        enabled: !state.loading && state.userData?.role === "Admin",
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

    return {
        allTB: query.data ?? [],

        setTimeblockToast: setTimeblockToast,
        setTimeblock: setMutation.mutateAsync,
        deleteTimeblockToast,

        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,

    };

}

// Published shifts without their tasks. Only active volunteers can read these.
export function useVolunteerTimeBlocks() {
    const { state } = useAuth();

    const query = useQuery({
        queryKey: ["timeblocks-volunteer"],
        queryFn: fetchVolunteerTB,
        enabled: !state.loading && isActiveVolunteer(state.userData),
    });

    return {
        volunteerTB: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}

// Refreshing on failure too, since a "group is full" error means the list on screen
// was stale.
export function useShiftSignup() {
    const queryClient = useQueryClient();
    const { state } = useAuth();
    const userId = state.currentUser?.uid;

    const run = async (
        action: (uid: string) => Promise<void>,
        messages: { loading: string; success: string; fallback: string }
    ) => {
        if (!userId) {
            toast.error("Please log in to continue.");
            return;
        }
        const toastId = toast.loading(messages.loading);
        try {
            await action(userId);
            toast.success(messages.success, { id: toastId });
        } catch (err) {
            // Firebase errors carry a code and get the generic wording; the service
            // throws plain Errors whose message is written for the volunteer.
            if ((err as { code?: string })?.code || !(err instanceof Error)) {
                toast.error(messages.fallback, { id: toastId, description: writeErrorMessage(err) });
            } else {
                toast.error(err.message, { id: toastId });
            }
        }
        queryClient.invalidateQueries({ queryKey: ["timeblocks-volunteer"] });
        queryClient.invalidateQueries({ queryKey: ["timeblocks-public"] });
    };

    return {
        signUpToast: (tbId: string, groupName: string) =>
            run((uid) => signUpForShift(tbId, groupName, uid), {
                loading: "Signing up...",
                success: "Signed up successfully!",
                fallback: "Couldn't sign up for shift",
            }),
        dropToast: (tbId: string) =>
            run((uid) => dropShift(tbId, uid), {
                loading: "Dropping shift...",
                success: "Shift dropped.",
                fallback: "Couldn't drop shift",
            }),
    };
}

// Anonymous projection (no notes, no volunteer ids) for visitors without an active
// volunteer account.
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
