import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAllUsers, getUserByUID, updateUser } from "../services/users";
import { UserData } from "@/types/user";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useAllActiveAccounts() {
    return useAllAccounts(true);
}

export function useAllAccountRequests() {
    return useAllAccounts(false);
}

function useAllAccounts(onlyActive: boolean) {
    const queryClient = useQueryClient();
    const { state } = useAuth();

    const query = useQuery({
        queryKey: ["users", onlyActive],
        queryFn: async () => {
            const allUsers = await fetchAllUsers();
            return allUsers.filter(user => ((user.pending === null) == onlyActive));
        },
        // Listing the whole users collection is admin-only under the Firestore rules.
        enabled: !state.loading && state.userData?.role === "Admin",
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
        onError: (_error, _newUserData, context) => {
            if (context?.prevData) {
                queryClient.setQueryData(["users"], context.prevData);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
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

// A single user document: readable by that user and by admins.
export function useUser(uid: string | undefined, options?: { enabled?: boolean }) {
    const query = useQuery({
        queryKey: ["user", uid],
        queryFn: () => getUserByUID(uid!),
        enabled: !!uid && (options?.enabled ?? true),
    });

    return {
        user: query.data ?? null,
        isLoading: query.isLoading,
    };
}

// Editing your own profile must not depend on the admin-only users listing.
export function useUpdateOwnProfile() {
    const { refreshUser } = useAuth();

    const mutation = useMutation({
        mutationFn: updateUser,
        onSuccess: () => refreshUser(),
    });

    const editAccount = async (newUserData: UserData) => {
        const promise = mutation.mutateAsync(newUserData);
        toast.promise(promise, {
            loading: "Updating profile...",
            success: "Profile updated successfully!",
            error: "Error: Couldn't update profile",
        });
        await promise;
    };

    return { editAccount, isSaving: mutation.isPending };
}
