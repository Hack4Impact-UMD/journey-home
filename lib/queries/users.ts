import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAllUsers, getUserByUID, updateUser } from "../services/users";
import { UserData } from "@/types/user";
import { toast } from "sonner";

export function useAllActiveAccounts() {
    return useAllAccounts(true);
}

export function useAllAccountRequests() {
    return useAllAccounts(false);
}

function useAllAccounts(onlyActive: boolean) {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["users", onlyActive],
        queryFn: async () => {
            const allUsers = await fetchAllUsers();
            return allUsers.filter(user => ((user.pending === null) == onlyActive));
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (newUserData: UserData) => {
            await updateUser(newUserData);
        },
        onMutate: async (newUserData: UserData) => {
            await queryClient.cancelQueries({ queryKey: ["users"] });
            const prevData = queryClient.getQueryData<UserData[]>(["users"]);

            queryClient.setQueryData(["users"], (oldData: UserData[] | undefined) => {
                if (!oldData) return [newUserData];
                return oldData.map((user) =>
                    user.uid === newUserData.uid ? newUserData : user,
                );
            });

            return { prevData };
        },
        onError: (error, newUserData, context) => {
            if (context?.prevData) {
                queryClient.setQueryData(["users"], context.prevData);
            }
        },
    });

    const updateAccount = async (newUserData: UserData) => {
        try {
            const promise = updateMutation.mutateAsync(newUserData);
            toast.promise(promise, {
                loading: "Updating user...",
                success: "User updated successfully!",
                error: "Error: Couldn't update user",
            });
            await promise;
        } catch (error) {
            // Error already handled by toast.promise
        }
    };

    return {
        allAccounts: query.data ?? [],

        editAccount: updateAccount,

        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}

/**
 * Hook for fetching and updating a single user account
 * @param uid - User ID to fetch
 * @returns account data, edit function, and loading states
 */
export function useAccount(uid: string) {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["user", uid],
        queryFn: async () => {
            return await getUserByUID(uid);
        },
        enabled: !!uid,
    }); 

    const updateMutation = useMutation({
        mutationFn: async (newUserData: UserData) => {
            await updateUser(newUserData);
        },
        onMutate: async (newUserData: UserData) => {
            await queryClient.cancelQueries({ queryKey: ["user", uid] });
            const prevData = queryClient.getQueryData<UserData>(["user", uid]);

            queryClient.setQueryData(["user", uid], newUserData);

            return { prevData };
        },
        onError: (error, newUserData, context) => {
            if (context?.prevData) {
                queryClient.setQueryData(["user", uid], context.prevData);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user", uid] });
            queryClient.invalidateQueries({ queryKey: ["users"] });
        }
    });
    const editAccount = async (newUserData: UserData) => {
        try {
            const promise = updateMutation.mutateAsync(newUserData);
            toast.promise(promise, {
                loading: "Updating account...",
                success: "Account updated successfully!",
                error: "Error: Couldn't update account",
            });
            await promise;
        } catch (error) {
            // Error already handled by toast.promise
        }
    };

    return {
        account: query.data ?? null,
        editAccount,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
