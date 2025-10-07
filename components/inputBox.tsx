import {InputBoxProps} from '../types/button';

export default function InputBox({ type = 'text', value, onChange, placeholder }: InputBoxProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border border-black rounded-[5px] text-[16px] w-[452px] h-[46px] p-2"
    />
  );
}