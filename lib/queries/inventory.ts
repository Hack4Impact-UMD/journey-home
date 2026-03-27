import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InventoryCategory } from "@/types/inventory";
import { getAllInventoryCategories, setInventoryCategory } from "../services/inventory";
import { toast } from "sonner";

export function useInventoryCategories() {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["inventoryCategories"],
        queryFn: getAllInventoryCategories,
    });

    const setMutation = useMutation({
        mutationFn: setInventoryCategory,
        onMutate: async (category: InventoryCategory) => {
            await queryClient.cancelQueries({ queryKey: ["inventoryCategories"] });
            const prevData = queryClient.getQueryData<InventoryCategory[]>(["inventoryCategories"]);

            queryClient.setQueryData(["inventoryCategories"], (oldData: InventoryCategory[] | undefined) => {
                if (!oldData) return [category];

                if (oldData.find((c) => c.id === category.id)) {
                    return oldData.map((c) => c.id === category.id ? category : c);
                }

                return oldData.concat([category]);
            });

            return { prevData };
        },
        onError: (error, category, context) => {
            if (context?.prevData) {
                queryClient.setQueryData(["inventoryCategories"], context.prevData);
            }
        },
    });

    const setInventoryCategoryWithToast = async (category: InventoryCategory) => {
        const promise = setMutation.mutateAsync(category);
        toast.promise(promise, {
            loading: "Updating category...",
            success: "Category updated successfully!",
            error: "Error: Couldn't update category",
        });
        await promise;
    };

    return {
        inventoryCategories: query.data ?? [],

        setInventoryCategory: setMutation.mutateAsync,
        setInventoryCategoryWithToast,

        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
