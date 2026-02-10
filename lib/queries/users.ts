import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAllUsers, updateUser } from "../services/users";
import { UserData } from "@/types/user";
import { toast } from "sonner";

export function useAllAccounts() {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["users"],
        queryFn: fetchAllUsers,
    });

    const updateMutation = useMutation({
        mutationFn: async (newUserData: UserData) => {
            await updateUser(newUserData);
        },
        onMutate: async (newUserData: UserData) => {
            await queryClient.cancelQueries({ queryKey: ["users"] });
            const prevData = queryClient.getQueryData<UserData[]>(["users"]);

            queryClient.setQueryData(["users"], (oldData: UserData[]) => {
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
        await toast.promise(updateMutation.mutateAsync(newUserData), {
            loading: "Updating user...",
            success: "User updated successfully!",
            error: "Error: Couldn't update user",
        });
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
