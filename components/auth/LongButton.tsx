
export interface LongButtonProps {
  name: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
}

export default function LongButton({ name, type = 'button', disabled = false, onClick }: LongButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`w-full h-10 rounded-xs bg-primary text-white hover:cursor-pointer ${
        disabled ? 'opacity-50' : ''
      }`}
    >
      {name}
    </button>
  );
}