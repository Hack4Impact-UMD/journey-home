import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { InventoryCategory, InventoryChange } from "@/types/inventory";
import { getAllInventoryCategories, deleteInventoryCategory, WAREHOUSE_COLLECTION } from "../services/inventory";
import { WAREHOUSE_HISTORY_COLLECTION } from "../services/warehouseHistory";
import { db } from "../firebase";
import { doc, getDoc, writeBatch, Timestamp } from "firebase/firestore";
import { toast } from "sonner";

export function useInventoryCategories() {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["inventoryCategories"],
        queryFn: getAllInventoryCategories,
    });

    const setMutation = useMutation({
        mutationFn: async ({
            category,
            userId,
            revertedChange,
        }: {
            category: InventoryCategory;
            userId: string;
            revertedChange?: InventoryChange;
        }) => {
            const prevSnap = await getDoc(doc(db, WAREHOUSE_COLLECTION, category.id));
            const oldQuantity = prevSnap.exists() ? (prevSnap.data() as InventoryCategory).quantity : 0;

            const batch = writeBatch(db);

            batch.set(doc(db, WAREHOUSE_COLLECTION, category.id), category);

            if (category.quantity !== oldQuantity) {
                const newChange: InventoryChange = {
                    id: uuidv4(),
                    userId,
                    timestamp: Timestamp.now(),
                    change: {
                        category: category.name,
                        oldQuantity,
                        newQuantity: category.quantity,
                    },
                    reverted: false,
                };
                batch.set(doc(db, WAREHOUSE_HISTORY_COLLECTION, newChange.id), newChange);
            }

            if (revertedChange) {
                batch.update(doc(db, WAREHOUSE_HISTORY_COLLECTION, revertedChange.id), { reverted: true });
            }

            await batch.commit();
        },
        onMutate: async ({ category }) => {
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
        onError: (_, __, context) => {
            if (context?.prevData) {
                queryClient.setQueryData(["inventoryCategories"], context.prevData);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["warehouseHistory"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (categoryId: string) => {
            await deleteInventoryCategory(categoryId);
        },
        onMutate: async (categoryId) => {
            await queryClient.cancelQueries({ queryKey: ["inventoryCategories"] });
            const prevData = queryClient.getQueryData<InventoryCategory[]>(["inventoryCategories"]);
            queryClient.setQueryData(["inventoryCategories"], (oldData: InventoryCategory[] | undefined) =>
                oldData ? oldData.filter((c) => c.id !== categoryId) : []
            );
            return { prevData };
        },
        onError: (_, __, context) => {
            if (context?.prevData) {
                queryClient.setQueryData(["inventoryCategories"], context.prevData);
            }
        },
    });

    const setInventoryCategory = (category: InventoryCategory, userId: string, revertedChange?: InventoryChange) =>
        setMutation.mutateAsync({ category, userId, revertedChange });

    const setInventoryCategoryWithToast = async (category: InventoryCategory, userId: string, revertedChange?: InventoryChange) => {
        const promise = setInventoryCategory(category, userId, revertedChange);
        toast.promise(promise, {
            loading: "Updating category...",
            success: "Category updated successfully!",
            error: "Error: Couldn't update category",
        });
        await promise;
    };

    const deleteInventoryCategoryWithToast = async (categoryId: string) => {
        const promise = deleteMutation.mutateAsync(categoryId);
        toast.promise(promise, {
            loading: "Deleting category...",
            success: "Category deleted.",
            error: "Error: Couldn't delete category",
        });
        await promise;
    };

    return {
        inventoryCategories: query.data ?? [],
        setInventoryCategory,
        setInventoryCategoryWithToast,
        deleteInventoryCategoryWithToast,
        isMutating: setMutation.isPending,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
