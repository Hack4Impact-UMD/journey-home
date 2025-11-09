"use client";

export type SortKeyToggle = "Quantity" | "Date";

function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function SortToggle({
  sortBy,
  ascending,
  onChange,
}: {
  sortBy: SortKeyToggle;
  ascending: boolean;
  onChange: (key: SortKeyToggle, asc: boolean) => void;
}) {
  const base =
    "h-10 px-4 inline-flex items-center gap-2 rounded-[2px] border text-base font-medium " +
    "bg-white shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500";

  const Chip = ({ label }: { label: SortKeyToggle }) => {
    const active = sortBy === label;
    const nextAsc = active ? !ascending : true;
    const borderClass =
      label === "Quantity"
        ? "border-gray-300"
        : active
        ? "border-cyan-500"
        : "border-gray-300";

    return (
      <button
        type="button"
        onClick={() => onChange(label, nextAsc)}
        className={cx(base, borderClass, "text-gray-900 cursor-pointer")}
        aria-pressed={active}
      >
        {label === "Quantity" ? "Qnt" : "Date"}{" "}
        <span className="text-gray-700">↓↑</span>
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
