"use client";
import React, { useState, useMemo } from "react";
import FilterBar from "../../../components/FilterBar";
import DonationRequestsTable from "../../../components/DonationRequestsTable";
import ItemViewModal from "../../../components/ItemViewModal";

const DONATIONS = [
  { id: "1", name: "Martin Gouse", quantity: 3, date: "9/22/2025", status: "Unfinished", category: "Clothing", responded: false },
  { id: "2", name: "John Doe", quantity: 1, date: "9/22/2025", status: "Finished", category: "Electronics", responded: true },
  { id: "3", name: "Talan Donin", quantity: 1, date: "9/22/2025", status: "Finished", category: "Furniture", responded: true },
  { id: "4", name: "Roger Lipshutz", quantity: 5, date: "9/22/2025", status: "Unfinished", category: "Books", responded: false },
  { id: "5", name: "Erin Donin", quantity: 2, date: "9/22/2025", status: "Unfinished", category: "Toys", responded: false },
  { id: "6", name: "Livia Passaquindici Arcand", quantity: 7, date: "9/22/2025", status: "Finished", category: "Clothing", responded: true },
  { id: "7", name: "Brandon Schleifer", quantity: 1, date: "9/22/2025", status: "Finished", category: "Electronics", responded: true },
  { id: "8", name: "Zain Rosser", quantity: 1, date: "9/22/2025", status: "Not reviewed", category: "Books", responded: false },
  { id: "9", name: "Craig Stanton", quantity: 3, date: "9/22/2025", status: "Not reviewed", category: "Furniture", responded: false },
  { id: "10", name: "Martin Gouse", quantity: 3, date: "9/22/2025", status: "Not reviewed", category: "Clothing", responded: false },
  { id: "11", name: "Nolan Gouse", quantity: 8, date: "9/22/2025", status: "Not reviewed", category: "Toys", responded: false },
  { id: "12", name: "James Vetrovs", quantity: 1, date: "9/22/2025", status: "Finished", category: "Electronics", responded: true },
  { id: "13", name: "Ann Lipshutz", quantity: 2, date: "9/22/2025", status: "Finished", category: "Books", responded: true },
];

export default function DonationRequestsPage() {
  const [items, setItems] = useState(DONATIONS);
  const [category, setCategory] = useState("Any");
  const [search, setSearch] = useState("");
  const [sortDesc, setSortDesc] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const filtered = useMemo(() => {
    let filtered = items;
    if (category !== "Any") filtered = filtered.filter((d) => d.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter((d) =>
        d.name.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.status.toLowerCase().includes(q)
      );
    }
    return filtered.sort((a, b) => sortDesc ? b.quantity - a.quantity : a.quantity - b.quantity);
  }, [items, category, search, sortDesc]);

  const handleViewItem = (item: any) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleApprove = () => {
    if (selectedItem) {
      setItems(items.map(item => 
        item.id === selectedItem.id ? { ...item, status: "Finished", responded: true } : item
      ));
      setShowModal(false);
    }
  };

  const handleReject = () => {
    if (selectedItem) {
      setItems(items.filter(item => item.id !== selectedItem.id));
      setShowModal(false);
    }
  };

  return (
    <>
      <FilterBar
        category={category}
        setCategory={setCategory}
        search={search}
        setSearch={setSearch}
        sortDesc={sortDesc}
        toggleSort={() => setSortDesc((v) => !v)}
      />

      <DonationRequestsTable items={filtered} onViewItem={handleViewItem} />

      {showModal && selectedItem && (
        <ItemViewModal
          item={selectedItem}
          onClose={() => setShowModal(false)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </>
  );
}