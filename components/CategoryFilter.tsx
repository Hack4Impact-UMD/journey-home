"use client";

import { useMemo } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  categories?: string[]; // if not provided, defaults to ["Couches","Chairs","Tables"]
  label?: string;
};
export default function CategoryFilter({ value, onChange, categories, label="Category" }: Props) {
  const opts = useMemo(
    () => ["Any", ...(categories?.length ? categories : ["Couches","Chairs","Tables"])],
    [categories]
  );
  return (
    <label className="inline-flex items-center gap-2">
      <span className="text-sm font-medium text-gray-600">{label}:</span>
      <select
        className="h-9 rounded-md border border-gray-300 bg-white px-2 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {opts.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
