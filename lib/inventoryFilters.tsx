import { InventoryRecord } from "@/types/inventory";
import { SortKey } from "@/components/SortMenu";

export type InventoryFilters = { category: string; size: string; inStockOnly: boolean; };

export function uniqueCategories(items: InventoryRecord[]): string[] {
  return Array.from(new Set(items.map(i => i.category))).sort();
}

export function applyFiltersAndSort(
  items: InventoryRecord[],
  filters: InventoryFilters,
  sortBy: SortKey
): InventoryRecord[] {
  let list = items.filter(i => {
    if (filters.category !== "Any" && i.category !== filters.category) return false;
    if (filters.size !== "Any" && i.size !== filters.size) return false;
    if (filters.inStockOnly && (!i.quantity || i.quantity <= 0)) return false;
    return true;
  });

  switch (sortBy) {
    case "Highest stock": list.sort((a,b)=>(b.quantity??0)-(a.quantity??0)); break;
    case "Lowest stock":  list.sort((a,b)=>(a.quantity??0)-(b.quantity??0)); break;
    case "Newest":        list.sort((a,b)=>b.dateAdded.toMillis()-a.dateAdded.toMillis()); break;
    case "Oldest":        list.sort((a,b)=>a.dateAdded.toMillis()-b.dateAdded.toMillis()); break;
    case "A–Z":           list.sort((a,b)=>a.name.localeCompare(b.name)); break;
    case "Z–A":           list.sort((a,b)=>b.name.localeCompare(a.name)); break;
  }
  return list;
}
