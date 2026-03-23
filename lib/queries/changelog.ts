import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InventoryChange } from "@/types/inventory";
import {
    getWarehouseHistory,
    setWarehouseChange,
} from "../services/warehouseHistory";
import { setInventoryRecord, getInventoryRecord } from "../services/inventory";
import { Timestamp } from "firebase/firestore";
import { toast } from "sonner";

export const CHANGELOG_QUERY_KEY = ["warehouseHistory"];

export function useWarehouseHistory(startDate?: Date, endDate?: Date) {
    const query = useQuery({
        queryKey: [...CHANGELOG_QUERY_KEY, startDate?.toISOString(), endDate?.toISOString()],
        queryFn: () => getWarehouseHistory(startDate, endDate),
    });

    return {
        changes: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}

export function useSetChange() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: setWarehouseChange,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CHANGELOG_QUERY_KEY });
        },
    });

    return mutation;
}

/**
 * Revert a changelog entry by restoring the inventory item's quantity to amountBefore.
 * Also writes a new changelog entry recording the revert.
 */
export function useRevertChange() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (change: InventoryChange) => {
            const item = await getInventoryRecord(change.itemId);
            if (!item) throw new Error("Item not found");

            const reverted = { ...item, quantity: change.amountBefore };
            // Pass no actor here — we write the changelog entry manually below
            await setInventoryRecord(reverted);

            const revertEntry: InventoryChange = {
                id: crypto.randomUUID(),
                itemId: change.itemId,
                itemName: change.itemName,
                changeType: "Set",
                changeAmount: change.amountBefore - item.quantity,
                amountBefore: item.quantity,
                amountAfter: change.amountBefore,
                timestamp: Timestamp.now(),
                userId: change.userId,
                userEmail: change.userEmail,
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

    return mutation;
}
