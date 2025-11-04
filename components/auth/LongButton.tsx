
export interface LongButtonProps {
  name: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export default function LongButton({ name, type = 'button', disabled = false }: LongButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`w-full h-10 rounded-xs text-white hover:cursor-pointer ${
        disabled ? 'bg-gray-400' : 'bg-primary'
      }`}
    >
      {name}
    </button>
  );
}