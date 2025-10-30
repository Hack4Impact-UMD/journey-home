"use client";

const SIZES = ["Any","Small","Medium","Large"] as const;

export default function SizeFilter({
  value,
  onChange,
  placeholder = "Size",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <span className="sr-only">Size</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          appearance-none
          rounded-md border border-gray-300 bg-white
          px-3 py-2 text-sm font-medium text-gray-700
          shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500
          pr-8
        "
        style={{ WebkitAppearance: "none" }}
      >
        {/* Show 'Size' label when Any */}
        <option value="Any">{placeholder}</option>
        {SIZES.slice(1).map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
        viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
      >
        <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z"/>
      </svg>
    </div>
  );
}
