"use client";

interface FormTextareaProps {
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  rows?: number;
}

export default function FormTextarea({
  label,
  value = "",
  onChange,
  className = "",
  rows = 3,
}: FormTextareaProps) {
  return (
    <div className={className}>
      <label className="block mb-2 text-sm text-gray-700">{label}</label>
      <textarea
        rows={rows}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded px-3 py-2"
      />
    </div>
  );
}

