"use client";

export type SortKey =
  | "Newest"
  | "Oldest"
  | "Highest stock"
  | "Lowest stock"
  | "A–Z"
  | "Z–A";

type Props = {
  value: SortKey;
  onChange: (v: SortKey) => void;
};

const OPTIONS: SortKey[] = ["Highest stock","Lowest stock","Newest","Oldest","A–Z","Z–A"];

export default function SortMenu({ value, onChange }: Props) {
  return (
    <label className="inline-flex items-center gap-2">
      <span className="text-sm font-medium text-gray-600">Sort:</span>
      <select
        className="h-9 rounded-md border border-gray-300 bg-white px-2 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
      >
        {OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
