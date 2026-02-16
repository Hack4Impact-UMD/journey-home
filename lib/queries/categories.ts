import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategoryAttributes, setCategoryAttributes } from "../services/inventory";
import { CategoryAttributes } from "@/types/inventory";
import { toast } from "sonner";
import { useMemo } from "react";

export function useCategories() {

    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["categories"],
        queryFn: getCategoryAttributes
    });

    const setMutation = useMutation({
        mutationFn: setCategoryAttributes,
        onMutate: async (attrs: CategoryAttributes[]) => {
            await queryClient.cancelQueries({queryKey: ["categories"]});
            const prevData = queryClient.getQueryData<CategoryAttributes[]>(["categories"]);

            queryClient.setQueryData(["users"], attrs);
            return { prevData }
        },
        onError: (error, attrs, context) => {
            if (context?.prevData) {
                queryClient.setQueryData(["categories"], context.prevData);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        }
    });

    const setCategoriesWithToast = async (attrs: CategoryAttributes[]) => {
        const promise = setMutation.mutateAsync(attrs);
        toast.promise(promise, {
            loading: "Updating categories...",
            success: "User categories successfully!",
            error: "Error: Couldn't update categories",
        });
        await promise;
    }

    const fallback = {
        name: "Other",
        lowThreshold: 0,
        highThreshold: 0
    } as CategoryAttributes;

    return {
        allAttrs: query.data ?? [fallback,],
        allCategories: useMemo(() => query.data?.map(attr => attr.name) ?? [fallback.name,], [query.data, fallback.name]),

        setCategories: setMutation.mutateAsync,
        setCategoriesWithToast,

        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch
    }

}