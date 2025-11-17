"use client";

type Props = {
  value: string;
  onChange: (v: string) => void;
  categories?: string[];
};

export default function CategorySelect({ value, onChange, categories }: Props) {
  const opts = ["Any", ...(categories?.length ? categories : ["Sofa","Chair","Table","Appliance"])];

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          h-10 min-w-[150px] pr-8
          appearance-none rounded-[2px] border border-gray-300 bg-white
          px-3 text-sm font-medium text-gray-900
          shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 cursor-pointer
        "
        style={{ WebkitAppearance: "none" }}
      >
        <option value="Any">Categories</option>
        {opts.slice(1).map((o) => <option key={o} value={o}>{o}</option>)}
      </select>

      {/* caret ▼ */}
      <svg
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
        viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
      >
        <path d="M5 7l5 6 5-6H5z" />
      </svg>
    </div>
  );
}
