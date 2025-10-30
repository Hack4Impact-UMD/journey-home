"use client";

import clsx from "clsx";
import { ChevronDown, ChevronUp } from "lucide-react";

export type PresetKey = "Quantity" | "Date";

export default function SortPreset({
  sortBy,
  ascending,
  onChange,
}: {
  sortBy: PresetKey;
  ascending: boolean;
  onChange: (key: PresetKey, asc: boolean) => void;
}) {
  const Chip = ({ label }: { label: PresetKey }) => {
    const active = sortBy === label;
    const nextAsc = active ? !ascending : true;

    return (
      <button
        type="button"
        onClick={() => onChange(label, nextAsc)}
        className={clsx(
          "inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm font-medium",
          active
            ? "border-cyan-500 text-cyan-700 bg-cyan-50"
            : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50",
          "shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
        )}
        aria-pressed={active}
      >
        {label === "Quantity" ? "Qnt" : "Date"}
        {active ? (ascending ? <ChevronUp size={16}/> : <ChevronDown size={16}/>) : <ChevronDown size={16}/>}
      </button>
    );
  };

  return (
    <div className="inline-flex items-center gap-2">
      <Chip label="Quantity" />
      <Chip label="Date" />
    </div>
  );
}
