import {LongButtonProps} from '../types/button';


export default function LongButton({ name, type = 'button', disabled = false }: LongButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`w-full h-12 rounded-[8px] font-semibold text-white hover:cursor-pointer ${
        disabled ? 'bg-gray-400' : 'bg-primary'
      }`}
    >
      {name}
    </button>
  );
}
