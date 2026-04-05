import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { WarehouseChange } from "@/types/changelog";
import { getWarehouseHistory, setWarehouseChange } from "../services/warehouseHistory";
import { deleteInventoryRecord, setInventoryRecord, getInventoryRecord } from "../services/inventory";
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

            const isCreate = change.changeType === "Create";
            const success = isCreate
                ? await deleteInventoryRecord(change.itemId)
                : await setInventoryRecord({ ...item, quantity: change.amountBefore });
            if (!success) throw new Error("Failed to update inventory during revert");

            const revertEntry: WarehouseChange = {
                id: crypto.randomUUID(),
                itemId: change.itemId,
                itemName: change.itemName,
                changeType: isCreate
                    ? "Delete"
                    : change.amountBefore > change.amountAfter
                        ? "Add"
                        : change.amountBefore < change.amountAfter
                            ? "Remove"
                            : "Set",
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
        revert: setMutation.mutateAsync,
        isReverting: setMutation.isPending,
    };
}
