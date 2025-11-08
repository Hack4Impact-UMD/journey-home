"use client";

interface FormSelectProps {
  label: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  className?: string;
}

export default function FormSelect({
  label,
  required = false,
  value = "",
  onChange,
  options,
  className = "",
}: FormSelectProps) {
  return (
    <div className={className}>
      <label className="block mb-2">
        {required && <span className="text-red-500">* </span>}
        <span className="text-sm text-gray-700">{label}</span>
      </label>
      <select
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded px-3 py-2"
      >
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

