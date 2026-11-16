"use client";

import { MAX_NOTES } from "@/lib/utils/limits";

interface FormTextareaProps {
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  rows?: number;
  maxLength?: number;
}

export default function FormTextarea({
  label,
  value = "",
  onChange,
  className = "",
  rows = 3,
  maxLength = MAX_NOTES,
}: FormTextareaProps) {
  const remaining = maxLength - value.length;

  return (
    <div className={className}>
      <label className="block mb-2 text-sm text-gray-700">{label}</label>
      <textarea
        rows={rows}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        className="w-full border border-gray-300 rounded px-3 py-2"
      />
      {remaining <= maxLength / 10 && (
        <p className="mt-1 text-sm text-gray-500">
          {remaining === 0
            ? "You've reached the character limit."
            : `${remaining.toLocaleString()} characters left.`}
        </p>
      )}
    </div>
  );
}
