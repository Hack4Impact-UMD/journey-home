"use client";
import React from "react";

type FilterBarProps = {
  category: string;
  setCategory: (val: string) => void;
  search: string;
  setSearch: (val: string) => void;
  sortDesc: boolean;
  toggleSort: () => void;
};

export default function FilterBar({
  category,
  setCategory,
  search,
  setSearch,
  sortDesc,
  toggleSort,
}: FilterBarProps) {
  const categories = ["Any", "Couches", "Chairs", "Tables"];

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      {/* Search box */}
      <div className="relative">
        <input
          type="search"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm w-[200px]"
        />
        <svg
          className="absolute left-3 top-2.5 text-gray-400"
          width="14"
          height="14"
          viewBox="0 0 20 20"
        >
          <path
            d="M12.9 14.32a8 8 0 111.41-1.41l4.38 4.38-1.42 1.42-4.37-4.39zM8 14a6 6 0 100-12 6 6 0 000 12z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Quantity sort button */}
      <button
        onClick={toggleSort}
        className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 text-sm hover:bg-gray-50"
        aria-label="Toggle quantity sort"
      >
        Qnt
        <svg width="12" height="12" viewBox="0 0 20 20" aria-hidden>
          <path
            d={sortDesc ? "M5 7l5 6 5-6" : "M5 13l5-6 5 6"}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </button>

      {/* Category dropdown */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm hover:bg-gray-50"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat === "Any" ? "Categories" : cat}
          </option>
        ))}
      </select>
    </div>
  );
}
