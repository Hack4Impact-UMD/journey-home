"use client";

interface FormInputProps {
  label: string;
  required?: boolean;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
  disabled?: boolean;
  min?: number;
}

export default function FormInput({
  label,
  required = false,
  value,
  onChange,
  type = "text",
  className = "",
  disabled = false,
  min,
}: FormInputProps) {
  return (
    <div className={className}>
      <label className="block mb-2">
        {required && <span className="text-red-500">* </span>}
        <span className="text-sm text-gray-700">{label}</span>
      </label>
      <input
        type={type}
        min={min}
        disabled={disabled}
        {...(onChange
          ? { value: value ?? "", onChange }
          : { value: value ?? "", readOnly: true })}
        className="w-full border border-gray-300 rounded px-3 py-2"
      />
    </div>
  );
}

