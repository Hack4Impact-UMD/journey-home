import { useQuery } from "@tanstack/react-query";
import { getWarehouseHistory } from "@/lib/services/warehouseHistory";

export const CHANGELOG_QUERY_KEY = ["warehouseHistory"];

// this could get expensive eventually if they get a lot of changes
// but i guess thats a later problem. (actually implementing start and end date + pagination)
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
