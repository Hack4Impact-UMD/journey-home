"use client";

export type SortKey = "Highest stock" | "Lowest stock" | "Newest" | "Oldest" | "A–Z" | "Z–A";

const OPTIONS: SortKey[] = [
  "Highest stock",
  "Lowest stock",
  "Newest",
  "Oldest",
  "A–Z",
  "Z–A",
];

export default function SortMenu({
  value,
  onChange,
  label = "Sort",
}: {
  value: SortKey;
  onChange: (v: SortKey) => void;
  label?: string;
}) {
  return (
    <label className="inline-flex items-center gap-2">
      <span className="text-sm text-gray-600">{label}</span>
      <select
        className="rounded-md border border-gray-300 bg-white px-2 py-2 text-sm outline-none focus:border-cyan-500"
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
      >
        {OPTIONS.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
