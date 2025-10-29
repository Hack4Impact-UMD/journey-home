"use client";
import React, { useState, useMemo } from "react";
import { WAREHOUSE_ITEMS } from "../data";
import InventoryFilters from "@/components/InventoryFilters";
import InventoryTable from "@/components/InventoryTable";
import InventoryGrid from "@/components/InventoryGrid";
import ItemDetailModal from "@/components/ItemDetailModal";


export default function DeniedDonationsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Any");
  const [size, setSize] = useState("Any");
  const [sortByQnt, setSortByQnt] = useState(true);
  const [sortByDate, setSortByDate] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [selectedDonor, setSelectedDonor] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const filtered = useMemo(() => {
    let result = WAREHOUSE_ITEMS.filter(item => item.status === "Denied");
    
    if (selectedDonor) result = result.filter(item => item.donor === selectedDonor);
    if (category !== "Any") result = result.filter(i => i.category === category);
    if (size !== "Any") result = result.filter(i => i.size === size);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(i => i.name.toLowerCase().includes(q) || i.donor.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
    }
    
    if (sortByQnt) result = result.sort((a, b) => b.quantity - a.quantity);
    if (sortByDate) result = result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return result;
  }, [search, category, size, sortByQnt, sortByDate, selectedDonor]);

  const handleViewDonor = (donor: string) => {
    setSelectedDonor(donor);
    setViewMode("grid");
  };

  return (
    <>
      <InventoryFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        size={size}
        setSize={setSize}
        onSortQnt={() => setSortByQnt(!sortByQnt)}
        onSortDate={() => setSortByDate(!sortByDate)}
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedDonor={selectedDonor}
        onBack={() => setSelectedDonor(null)}
      />

      {viewMode === "table" ? (
        <InventoryTable items={filtered} onViewDonor={handleViewDonor} />
      ) : (
        <InventoryGrid items={filtered} onItemClick={setSelectedItem} />
      )}

      {selectedItem && <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </>
  );
}