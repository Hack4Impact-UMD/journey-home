interface Item<T> {
  label: string;
  description?: string;
  field: keyof T;  // key in the object we want to update
  value: number;
}

interface CategoryBoxProps<T> {
  categoryName: string;
  items: Item<T>[];
  onChange: (update: Partial<T>) => void;
}

export default function CategoryBox<T>({ categoryName, items, onChange }: CategoryBoxProps<T>) {
  const handleQuantityChange = (index: number, value: string) => {
    const numericValue = value === "" ? 0 : Math.max(0, Number(value));
    const field = items[index].field;
    onChange({ [field]: numericValue } as Partial<T>);
  };

  return (
    <div className="border border-[#D9D9D9] rounded-md w-full max-w-2xl mx-auto">
      <div className="bg-[#D9D9D9] px-4 py-2 font-semibold">{categoryName}</div>

      <div className="grid grid-cols-2 px-4 py-2 font-bold bg-white">
        <div>Item Type</div>
        <div className="text-right">Quantity</div>
      </div>

      <div className="bg-white">
        {items.map((item, index) => (
          <div
            key={String(item.field)}
            className="grid grid-cols-2 px-4 py-2"
          >
            <div>
              <div>{item.label}</div>
              {item.description && <div className="text-[#BBBDBE] text-sm">{item.description}</div>}
            </div>
            <div className="text-right">
              <input
                type="number"
                min={0}
                value={item.value}
                onChange={(e) => handleQuantityChange(index, e.target.value)}
                className="w-70 border border-[#D9D9D9] rounded px-2 py-1 text-right"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
