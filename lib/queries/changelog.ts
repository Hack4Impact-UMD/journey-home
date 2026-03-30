import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InventoryChange } from "@/types/inventory";
import { getWarehouseHistory, setWarehouseChange } from "../services/warehouseHistory";
import { setInventoryRecord, getInventoryRecord } from "../services/inventory";
import { Timestamp } from "firebase/firestore";
import { toast } from "sonner";

export const CHANGELOG_QUERY_KEY = ["warehouseHistory"];

export function useWarehouseHistory(startDate?: Date, endDate?: Date) {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: [...CHANGELOG_QUERY_KEY, startDate?.toISOString(), endDate?.toISOString()],
        queryFn: () => getWarehouseHistory(startDate, endDate),
    });

    const revertMutation = useMutation({
        mutationFn: async ({
            change,
            actor,
        }: {
            change: InventoryChange;
            actor?: { userId: string; userEmail: string };
        }) => {
            const item = await getInventoryRecord(change.itemId);
            if (!item) throw new Error("Item not found");

            const reverted = { ...item, quantity: change.amountBefore };
            const success = await setInventoryRecord(reverted);
            if (!success) throw new Error("Failed to update inventory during revert");

            const revertEntry: InventoryChange = {
                id: crypto.randomUUID(),
                itemId: change.itemId,
                itemName: change.itemName,
                changeType: "Set",
                changeAmount: change.amountBefore - item.quantity,
                amountBefore: item.quantity,
                amountAfter: change.amountBefore,
                timestamp: Timestamp.now(),
                userId: actor?.userId ?? change.userId,
                userEmail: actor?.userEmail ?? change.userEmail,
            };
            await setWarehouseChange(revertEntry);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CHANGELOG_QUERY_KEY });
            toast.success("Change reverted successfully.");
        },
        onError: () => {
            toast.error("Failed to revert change.");
        },
    });

    return {
        changes: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        revert: revertMutation.mutateAsync,
        isReverting: revertMutation.isPending,
    };
}
