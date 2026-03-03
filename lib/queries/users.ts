import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAllUsers, getUserByUID, updateUser } from "../services/users";
import { UserData } from "@/types/user";
import { toast } from "sonner";

/**
 * Hook for fetching all active user accounts (non-pending users)
 * @returns Object containing active accounts array, edit function, and query states
 */
export function useAllActiveAccounts() {
    return useAllAccounts(true);
}

/**
 * Hook for fetching all pending account requests
 * @returns Object containing pending accounts array, edit function, and query states
 */
export function useAllAccountRequests() {
    return useAllAccounts(false);
}

/**
 * Internal hook for fetching user accounts with optional filtering
 * @param onlyActive - If true, returns only active accounts; if false, returns only pending requests
 * @returns Object containing accounts array, edit function, loading states, and refetch function
 */
function useAllAccounts(onlyActive: boolean) {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["users", onlyActive],
        queryFn: async () => {
            const allUsers = await fetchAllUsers();
            return allUsers.filter(user => ((user.pending == null) == onlyActive));
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        }
    });

    /**
     * Updates a user account with optimistic updates and toast notifications
     * @param newUserData - The updated user data to save
     */
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
    /**
     * Updates a single user account with optimistic updates and toast notifications
     * @param newUserData - The updated user data to save
     */
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
