import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { WarehouseChange } from "@/types/changelog";
import { getWarehouseHistory, setWarehouseChange } from "@/lib/services/warehouseHistory";
import { setInventoryRecord, getInventoryRecord, deleteInventoryRecord } from "@/lib/services/inventory";
import { Timestamp } from "firebase/firestore";
import { toast } from "sonner";

export const CHANGELOG_QUERY_KEY = ["warehouseHistory"];

export function useWarehouseHistory(startDate?: Date, endDate?: Date) {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: [...CHANGELOG_QUERY_KEY, startDate?.toISOString(), endDate?.toISOString()],
        queryFn: () => getWarehouseHistory(startDate, endDate),
    });

    const setMutation = useMutation({
        mutationFn: async ({
            change,
            actor,
        }: {
            change: WarehouseChange;
            actor?: { userId: string; userEmail: string };
        }) => {
            const item = await getInventoryRecord(change.itemId);
            if (!item) throw new Error("Item not found");
            if (item.quantity !== change.amountAfter) {
                throw new Error("Cannot revert: inventory has changed since this entry was recorded.");
            }

            const success = change.amountBefore === 0
                ? await deleteInventoryRecord(change.itemId)
                : await setInventoryRecord({ ...item, quantity: change.amountBefore });
            if (!success) throw new Error("Failed to update inventory during revert");

            const revertEntry: WarehouseChange = {
                id: crypto.randomUUID(),
                itemId: change.itemId,
                itemName: change.itemName,
                changeType: change.amountBefore >= change.amountAfter ? "Addition" : "Removal",
                changeAmount: change.amountBefore - change.amountAfter,
                amountBefore: change.amountAfter,
                amountAfter: change.amountBefore,
                timestamp: Timestamp.now(),
                userId: actor?.userId ?? change.userId,
                userEmail: actor?.userEmail ?? change.userEmail,
            };

            try {
                await setWarehouseChange(revertEntry);
            } catch (historyErr) {
                // rollback inventory
                const rollbackSuccess = await setInventoryRecord(item);
                if (!rollbackSuccess) throw new Error("Revert failed and rollback also failed");
                throw historyErr;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CHANGELOG_QUERY_KEY });
            toast.success("Change reverted successfully.");
        },
        onError: (error: Error) => {
            toast.error(error?.message || "Failed to revert change.");
        },
    });

    return {
        changes: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        revert: setMutation.mutateAsync,
        isReverting: setMutation.isPending,
    };
}
