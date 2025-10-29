"use client";

interface FormCheckboxProps {
  label: string;
  required?: boolean;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export default function FormCheckbox({
  label,
  required = false,
  checked,
  onChange,
  className = "",
}: FormCheckboxProps) {
  return (
    <div className={`flex gap-2 items-start ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1"
      />
      <label className="text-sm text-gray-700">
        {required && <span className="text-red-500">* </span>}
        {label}
      </label>
    </div>
  );
}

