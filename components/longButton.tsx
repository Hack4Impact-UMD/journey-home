import ButtonProps from '../types/button';


export default function longButton(props: ButtonProps) {
 const name = props.name;
 return (
   <button className="bg-primary text-white rounded-[5px] text-[16px] w-[452px] h-[56px] font-bold">
     {name}
   </button>
 );
}
