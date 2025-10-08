import { useState } from 'react';
import { InputBoxProps } from '../types/button';


export default function InputBox({ type = 'text', value, onChange, logo}: InputBoxProps) {
 const [isFocused, setIsFocused] = useState(false);


 const showLogo = !value && !isFocused; 


 return (
   <div className="relative w-[452px] h-[46px]">
     {showLogo && (
       <img
         src={logo}
         alt="Logo placeholder"
         className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 opacity-50 pointer-events-none"
       />
     )}
     <input
       type={type}
       value={value}
       onChange={onChange}
       onFocus={() => setIsFocused(true)}
       onBlur={() => setIsFocused(false)}
       className={`border border-black rounded-[5px] text-[16px] w-full h-full p-2 ${
         showLogo ? 'pl-10' : 'pl-2'
       }`}
     />
   </div>
 );
}
