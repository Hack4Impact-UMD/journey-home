import { useState } from 'react';

export interface InputBoxProps {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  logo?: string;
}


export default function InputBox({ type = 'text', value, onChange, logo}: InputBoxProps) {
 const [isFocused, setIsFocused] = useState(false);


 const showLogo = !value && !isFocused; 


 return (
   <div className="relative w-full h-8">
     {showLogo && (
       <img
         src={logo}
         alt="Logo placeholder"
         className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none"
       />
     )}
     <input
       type={type}
       value={value}
       onChange={onChange}
       onFocus={() => setIsFocused(true)}
       onBlur={() => setIsFocused(false)}
       className={`border border-[#D9D9D9] rounded-xs text-sm w-full h-full p-2 ${
         showLogo ? 'pl-10' : 'pl-2'
       }`}
     />
   </div>
 );
}
