import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAllUsers, updateUser } from "../services/users";
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

    const updateAccount = async (newUserData: UserData) => {
        const promise = updateMutation.mutateAsync(newUserData);
        toast.promise(promise, {
            loading: "Updating user...",
            success: "User updated successfully!",
            error: "Error: Couldn't update user",
        });
        await promise;
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
