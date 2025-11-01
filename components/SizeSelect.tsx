"use client";

const SIZES = ["Any","Small","Medium","Large"] as const;

export default function SizeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          h-10 min-w-[110px] pr-8
          appearance-none rounded-[2px] border border-gray-300 bg-white
          px-3 text-sm font-medium text-gray-900
          shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500
        "
        style={{ WebkitAppearance: "none" }}
      >
        <option value="Any">Size</option>
        {SIZES.slice(1).map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      <svg
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
        viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
      >
        <path d="M5 7l5 6 5-6H5z" />
      </svg>
    </div>
  );
}
