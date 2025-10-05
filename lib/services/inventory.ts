import {
    InventoryRecord,
    InventoryRecordData,
    SearchFilters,
} from "@/types/inventory";

const MAX_RESULTS = 25


export async function search(
    query: string,
    filters: SearchFilters,
    page: number = 0
): Promise<InventoryRecord[]> {
    // TODO: implement
    return [];
}


export async function createInventoryRecord(
    recordData: InventoryRecordData
): Promise<string> {
    // TODO: implement
    return "";
}


export async function getInventoryRecord(id: string): Promise<InventoryRecord | null> {
    // TODO: implement
    throw new Error("Not implemented yet");
}


export async function updateInventoryRecord(
    record: InventoryRecord
): Promise<boolean> {
    // TODO: implement
    return false;
}

export async function deleteInventoryRecord(id: string): Promise<boolean> {
    // TODO: implement
    return false;
}
