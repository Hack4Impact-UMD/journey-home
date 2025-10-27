interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export default function Checkbox({ label, checked, onChange, required }: CheckboxProps) {
  return (
    <label className="flex items-start gap-2 text-[15px] leading-snug">
      <input type="checkbox" checked={checked} onChange={onChange} required={required} />
      <span>{label}</span>
    </label>
  );
}
