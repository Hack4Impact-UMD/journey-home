interface SelectBoxProps {
  options: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name: string;
}

export default function SelectBox({ options, value, onChange, name }: SelectBoxProps) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="border border-black rounded-[5px] text-[16px] w-[452px] h-[46px] p-2"
    >
      <option value="">Select</option>
      {options.map((opt, idx) => (
        <option key={idx} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}