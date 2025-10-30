"use client";

type Props = {
  value: string; // "Any" | "Small" | "Medium" | "Large"
  onChange: (v: string) => void;
  label?: string;
};

const SIZES = ["Any","Small","Medium","Large"];

export default function SizeFilter({ value, onChange, label="Size" }: Props) {
  return (
    <label className="inline-flex items-center gap-2">
      <span className="text-sm font-medium text-gray-600">{label}:</span>
      <select
        className="h-9 rounded-full border border-gray-300 bg-white px-3 text-sm
                   focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    </label>
  );
}
