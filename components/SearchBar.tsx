"use client";
import { useState } from "react";

export default function SearchBar({
  onSearch,
}: {
  onSearch: (query: string) => Promise<void> | void;
}) {
  const [q, setQ] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(q);
  };

  return (
    <form onSubmit={submit} className="flex">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search"
        className="h-10 w-full rounded-l-[2px] border border-gray-300 bg-white px-3 text-sm outline-none"
      />
      <button
        type="submit"
        onClick={() => onSearch(q)}
        className="h-10 rounded-r-[2px] border border-l-0 border-gray-300 bg-white px-3 text-sm hover:bg-gray-50"
        aria-label="Search"
      >
        {/* magnifier icon could live here if you have one */}
        Q
      </button>
    </form>
  );
}
