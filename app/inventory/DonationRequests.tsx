"use client";
import React, { useState, useMemo } from "react";
import { DONATIONS } from "./data";
import FilterBar from "@/components/FilterBar"; // ✅ import shared FilterBar

/* Donation Requests Table*/
function DonationRequestsTable({ items }: { items: any[] }) {
  return (
    <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr className="text-sm text-gray-600">
            <th className="px-6 py-3 text-left font-medium">Name</th>
            <th className="px-6 py-3 text-left font-medium">Quantity</th>
            <th className="px-6 py-3 text-left font-medium">Date</th>
            <th className="px-6 py-3 text-left font-medium">Status</th>
            <th className="px-6 py-3 text-left font-medium">Donations</th>
            <th className="px-6 py-3 text-left font-medium">Responded</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-6 text-center text-gray-500 text-sm">
                No donation requests found.
              </td>
            </tr>
          ) : (
            items.map((d) => (
              <tr
                key={d.id}
                className="border-b border-gray-100 last:border-0 text-sm hover:bg-gray-50"
              >
                <td className="px-6 py-4 text-gray-900 font-medium">{d.name}</td>

                <td className="px-6 py-4">
                  <span className="inline-block px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800 font-semibold">
                    {d.quantity}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-600">{d.date}</td>

                <td className="px-6 py-4">
                  <span className="inline-block px-2 py-1 rounded text-xs bg-gray-200 text-gray-700">
                    {d.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <button className="px-3 py-1 bg-cyan-500 text-white text-xs rounded hover:bg-cyan-600">
                    View
                  </button>
                </td>

                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={d.responded}
                    readOnly
                    className="rounded accent-cyan-500"
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/* Main DonationRequestsTab */
export default function DonationRequestsTab() {
  const [category, setCategory] = useState("Any");
  const [search, setSearch] = useState("");
  const [sortDesc, setSortDesc] = useState(true);

  const filtered = useMemo(() => {
    let filtered = DONATIONS;
    if (category !== "Any") filtered = filtered.filter((d) => d.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q) ||
          d.status.toLowerCase().includes(q)
      );
    }
    filtered = filtered.sort((a, b) => (sortDesc ? b.quantity - a.quantity : a.quantity - b.quantity));
    return filtered;
  }, [category, search, sortDesc]);

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
      <DonationRequestsTable items={filtered} />
    </>
  );
}
