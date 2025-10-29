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
        className="h-9 rounded-md border border-gray-300 bg-white px-2 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    </label>
  );
}
