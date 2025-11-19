"use client";

export type FilterType = "all" | "pickups" | "deliveries";

type TypeFilterButtonsProps = {
    activeFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
};

export default function TypeFilterButtons({
    activeFilter,
    onFilterChange,
}: TypeFilterButtonsProps) {
    const filters: { key: FilterType; label: string }[] = [
        { key: "all", label: "Pickups & Deliveries" },
        { key: "pickups", label: "Pickups" },
        { key: "deliveries", label: "Deliveries" },
    ];

    return (
        <div className="flex gap-2">
            {filters.map((filter) => {
                const isActive = activeFilter === filter.key;
                return (
                    <button
                        key={filter.key}
                        type="button"
                        onClick={() => onFilterChange(filter.key)}
                        className={`px-4 py-1.5 rounded-[2px] text-sm border transition-colors ${
                            isActive
                                ? "bg-primary border-primary text-white"
                                : "bg-white border-light-border text-black"
                        }`}
                    >
                        {filter.label}
                    </button>
                );
            })}
        </div>
    );
}

