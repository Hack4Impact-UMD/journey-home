"use client";

import { useMemo } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  categories?: string[];
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
        className="h-9 rounded-full border border-gray-300 bg-white px-3 text-sm
                   focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {opts.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
